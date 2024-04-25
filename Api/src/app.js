const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/db');
const { v4: uuidv4 } = require('uuid');
const userRoutes = require('./api/routes/userRoutes');
const crypto = require('crypto');
const Event = require('./api/models/event');
const User = require('./api/models/usuari');
const app = express();
const Wordd = require('./api/models/word');

app.use(express.json());
app.set('json spaces', 2);

function generateApiKey(length = 64) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

mongoose.connect(dbConfig.MONGODB_URI).then(() => console.log("Connectat a MongoDB"))
  .catch(err => console.error("No s'ha pogut connectar a MongoDB", err));

app.get('/api/health', (req, res) => {
  res.json({ status: "OK" });
});

app.use('/api', userRoutes);

app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).send(event);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send("L'esdeveniment no s'ha trobat.");
    }
    res.send(event);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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


module.exports = app;
