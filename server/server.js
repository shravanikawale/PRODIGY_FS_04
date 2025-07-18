require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

io.on('connection', socket => {
  console.log("User connected:", socket.id);

  socket.on('joinRoom', room => socket.join(room));

  socket.on('sendMessage', async ({ sender, content, room }) => {
    const message = await Message.create({ sender, content, room });
    io.to(room).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => console.log('Server on port 5000'));
