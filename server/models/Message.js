const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  room: String,
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Message', MessageSchema);
