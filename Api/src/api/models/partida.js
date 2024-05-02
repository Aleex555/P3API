const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    _id: { type: String, required: true },
    nombrePartida: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date},
    tipo: { type: String, required: true },
    letrasDelRosco: [
        {
            letra: { type: String, required: true }
        }
    ],
    jugadores: [
        {
            uuidJugador: { type: String},
            nickname: { type: String},
            puntuacionTotal: { type: Number, default: 0 },
            palabrasPuntuadas: [
                {
                    palabra: { type: String, },
                    puntuacion: { type: Number, }
                }
            ]
        }
    ]
},{ collection: 'Partidas' });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
