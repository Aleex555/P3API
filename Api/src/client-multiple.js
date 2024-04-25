const io = require('socket.io-client');
const totalClients = 100;
const clients = [];

for (let i = 0; i < totalClients; i++) {
  const socket = io('http://127.0.0.1:3000');

  socket.on('connect', () => {
    console.log(`Client ${i} connected`);
    socket.emit('TEMPS_PER_INICI');
  });

  socket.on('TEMPS_PER_INICI', (data) => {
    console.log(`Client ${i}: Temps restant per l'inici: ${data.tempsRestant} ms, En Partida: ${data.enPartida ? 'Sí' : 'No'}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client ${i} disconnected`);
  });

  socket.on('connect_error', (error) => {
    console.error(`Client ${i} connection error:`, error);
  });

  clients.push(socket);
}