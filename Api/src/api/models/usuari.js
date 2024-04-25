const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  nickname: String,
  email: String,
  phone_number: String,
  api_key: { type: String, required: true },
  avatar: String,
  historial_partides: [String]

},{ collection: 'Usuarios' });

const User = mongoose.model('Usuario', userSchema);

module.exports = User;
