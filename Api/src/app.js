const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const Action = require('./api/models/action'); 
const User = require('./api/models/usuari');
const Game = require('./api/models/partida');
const app = express();
const Wordd = require('./api/models/word');


app.use(express.json());
app.set('json spaces', 2);

function generateApiKey(length = 64) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function generateRandomName() {
  const words = ["Eclipse", "Nova", "Orbit", "Pulsar", "Quasar", "Stellar", "Nebula", "Galaxy", "Meteor", "Cosmos", "Vortex", "Comet", "Asteroid", "Celestial", "Gravity", "Blackhole", "Starlight", "Moonlight", "Sunburst", "Horizon"];
  const randomIndex = Math.floor(Math.random() * words.length);
  const randomNumber = Math.floor(Math.random() * 10000);
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  return `${words[randomIndex]}-${randomNumber}${randomLetter}`;
}


mongoose.connect(dbConfig.MONGODB_URI).then(() => console.log("Connectat a MongoDB"))
  .catch(err => console.error("No s'ha pogut connectar a MongoDB", err));



app.post('/api/user/register', async (req, res) => {
  if (!req.body.email || !req.body.nickname) {
    return res.status(400).send("Email and nickname are required.");
  }
  try {
    const newUser = new User({
      uuid: uuidv4(),
      nickname: req.body.nickname,
      email: req.body.email,
      phone_number: req.body.phone_number,
      api_key: generateApiKey(),
      avatar: req.body.avatar,
      historial_partides: req.body.historial_partides || []
    });

    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    console.error("Error while registering user:", err);
    res.status(400).send(err.message);
  }
});

// Endpoint para obtener todos los idiomas disponibles
app.get('/api/languages', async (req, res) => {
  try {
    const languages = await Wordd.distinct('idioma');
    res.json(languages);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Endpoint para obtener palabras por idioma y letra inicial
app.get('/api/words/:idioma/:letter', async (req, res) => {
  try {
    const regex = new RegExp(`^${req.params.letter}`, 'i'); // Expresión regular para hacer la búsqueda insensible a mayúsculas
    const words = await Wordd.find({ 
      idioma: req.params.idioma,
      palabra: { $regex: regex }
    });
    res.json(words.map(word => word.palabra));  // Asegúrate de retornar el campo 'palabra'
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/user/update', async (req, res) => {
  const { api_key, nickname, email, phone_number, avatar } = req.body;

  if (!api_key) {
    return res.status(400).send("API key is required.");
  }

  try {
    // Busca el usuario por API key
    const user = await User.findOne({ api_key: api_key });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (nickname) user.nickname = nickname;
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (avatar) user.avatar = avatar;

    // Guarda los cambios en la base de datos
    await user.save();

    res.status(200).send(user);
  } catch (err) {
    console.error("Error while updating user:", err);
    res.status(500).send(err.message);
  }
});

// Endpoint para crear una nueva partida
app.post('/api/games', async (req, res) => {
  try {
    const offset = 2 * 60 * 60 * 1000; // 2 horas convertidas a milisegundos
    const fechaInicio = new Date(new Date().getTime() + offset);
    const newGame = new Game({
      _id: uuidv4(), // Genera un UUID para la partida
      nombrePartida: generateRandomName(), // Nombre de partida generado aleatoriamente
      fechaInicio: fechaInicio, // Fecha actual como fecha de inicio
      fechaFin: null, // Fecha de fin es null inicialmente
      tipo: "multijugador", // Tipo fijo como 'multijugador'
      letrasDelRosco: req.body.letrasDelRosco, // Letras del rosco enviadas en la solicitud
      jugadores: [] // Inicializa la lista de jugadores vacía
    });

    // Guardar la partida en la base de datos
    await newGame.save();

    // Enviar respuesta de éxito
    res.status(201).json(newGame);
  } catch (error) {
    // Enviar respuesta de error
    console.error("Error al crear la partida:", error);
    res.status(400).json({ message: error.message });
  }
});


// Endpoint para añadir un jugador a una partida existente utilizando apiKey
app.post('/api/games/:id/join', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key']; // Recupera el apiKey desde el header
    if (!apiKey) {
      return res.status(401).send("ApiKey no proporcionado.");
    }

    // Verifica que el apiKey corresponda a un usuario registrado
    const user = await User.findOne({ api_key: apiKey });
    if (!user) {
      return res.status(401).send("ApiKey inválido o usuario no encontrado.");
    }

    // Busca la partida por ID para recuperar el nombre y actualizar el documento
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).send("Juego no encontrado.");
    }

    // Si el usuario es válido, procede a añadirlo a la partida
    const gameUpdate = {
      $push: {
        jugadores: {
          uuidJugador: user.uuid, // Utiliza el uuid del usuario encontrado
          nickname: user.nickname,
          puntuacionTotal: 0,  // Inicializa la puntuación y otros campos según sea necesario
          palabrasPuntuadas: []
        }
      }
    };

    // Busca por ID y actualiza el documento correspondiente
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, gameUpdate, { new: true });

    if (!updatedGame) {
      return res.status(404).send("Juego no encontrado.");
    }

    // Crea y guarda la acción de unirse a la partida
    const joinAction = new Action({
      tipoAccion: "jugador_unido",
      nickname: user.nickname,
      uuidJugador: user.uuid,
      idPartida: req.params.id,
      nombrePartida: game.nombrePartida, 
      tiempoAccion: new Date() // Esto registrará el tiempo exacto en formato ISODate automáticamente
    });

    await joinAction.save();

    // Responde al cliente con la partida actualizada
    res.status(200).json(updatedGame);
  } catch (error) {
    console.error("Error al unir jugador a la partida:", error);
    res.status(400).json({ message: error.message });
  }
});

// Endpoint para actualizar las palabras puntuadas de un jugador por nickname
app.post('/api/games/:gameId/player/:nickname/word', async (req, res) => {
  try {
    const wordUpdate = {
      $push: {
        "jugadores.$.palabrasPuntuadas": {
          palabra: req.body.palabra,
          puntuacion: req.body.puntuacion
        }
      }
    };

    // Encuentra la partida y actualiza específicamente al jugador correcto
    // por nickname en lugar de uuidJugador
    const updatedGame = await Game.findOneAndUpdate(
      { _id: req.params.gameId, "jugadores.nickname": req.params.nickname },
      wordUpdate,
      { new: true }
    );

    if (!updatedGame) {
      return res.status(404).send("Juego o jugador no encontrado.");
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    console.error("Error al actualizar palabras puntuadas:", error);
    res.status(400).json({ message: error.message });
  }
});

// Endpoint para actualizar la fecha de finalización de una partida
app.patch('/api/games/:id/finish', async (req, res) => {
  try {
    const offset = 2 * 60 * 60 * 1000; // 2 horas convertidas a milisegundos
    const fechaFin = new Date(new Date().getTime() + offset);
    const gameId = req.params.id;

    // Configura la fecha de finalización con la fecha y hora actual del sistema
    const gameUpdate = {
      fechaFin: fechaFin  // Guarda la fecha y hora actual
    };

    // Actualiza el juego especificado por ID con la nueva fecha de finalización
    const updatedGame = await Game.findByIdAndUpdate(gameId, gameUpdate, { new: true });

    if (!updatedGame) {
      return res.status(404).send("Juego no encontrado.");
    }

    // Devuelve el juego actualizado
    res.status(200).json(updatedGame);
  } catch (error) {
    console.error("Error al actualizar la fecha de finalización del juego:", error);
    res.status(400).json({ message: error.message });
  }
});



module.exports = app;
