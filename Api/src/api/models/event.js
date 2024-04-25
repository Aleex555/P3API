const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  description: String,
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
