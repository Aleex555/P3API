const io = require('socket.io-client');

// Connecta al servidor; assegura't que l'URL coincideix amb la configuració del teu servidor
const socket = io('http://127.0.0.1:3000');

socket.on('connect', () => {
  console.log('Connectat al servidor');
  // Demana el temps restant immediatament després de connectar-se
  socket.emit('TEMPS_PER_INICI');
});

// Gestiona la resposta del servidor
socket.on('TEMPS_PER_INICI', (data) => {
  console.log(`Temps restant per l'inici: ${data.tempsRestant} ms, En Partida: ${data.enPartida ? 'Sí' : 'No'}`);
});

socket.on('disconnect', () => {
  console.log('Desconnectat del servidor');
});

// Gestiona errors de connexió
socket.on('connect_error', (error) => {
  console.error('Error de connexió:', error);
});
