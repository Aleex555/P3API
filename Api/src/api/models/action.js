const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  tipoAccion: {
    type: String,
    required: true,
    enum: ['jugador_unido', 'partida_creada', 'palabra_guardada', 'palabra_inexistente']
  },
  nickname: String, // Opcional, dependiendo de la acción
  uuidJugador: {
    type: String,
    required: true
  },
  idPartida: {
    type: String,
    required: true
  },
  nombrePartida: {
    type: String,
    required: true // Asegúrate de requerir o hacer opcional este campo según tus necesidades
  },
  tiempoAccion: {
    type: Date,
    default: Date.now // Asigna automáticamente la fecha y hora actuales
  },
  palabraPuntuacion: { // Este subdocumento es opcional, sólo para 'palabra_guardada'
    palabra: String,
    puntuacion: Number
  }
}, 
);

const Action = mongoose.model('Action', actionSchema);

module.exports = Action;
