const io = require('socket.io-client');
const readline = require('readline');

// Crea una interfície de readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connecta al servidor
const socket = io('http://127.0.0.1:3000');

socket.on('connect', () => {
  console.log('Connectat al servidor');
  mostrarMenu();
});

// Gestiona la resposta del servidor
socket.on('TEMPS_PER_INICI', (data) => {
  if (data.enPartida) {
      console.log(`\nTemps restant de la partida: ${Math.round(data.tempsRestant / 1000)}s, En Partida: Sí`);
  } else {
      console.log(`\nTemps restant per l'inici: ${Math.round(data.tempsRestant / 1000)}s, En Partida: No`);
  }
  mostrarMenu();
});

socket.on('ALTA_CONFIRMADA', (data) => {
  console.log(data.message);
  mostrarMenu();
});

socket.on('Puntuacion', (data) => {
  console.log(data.message);
  mostrarMenu();
});

socket.on('PARTIDA_INICIADA', (data) => {
  console.log(data.message);
  const soloLetras = data.letras.map(item => item.letra);
  console.log(soloLetras); 
  
  mostrarMenu();
});

socket.on('disconnect', () => {
  console.log('Desconnectat del servidor');
  process.exit();
});

// Gestiona errors de connexió
socket.on('connect_error', (error) => {
  console.error('Error de connexió:', error);
});

function mostrarMenu() {
  console.log('\nSelecciona una opció:');
  console.log('1: Consultar temps per a l\'inici');
  console.log('2: Alta a la partida');
  console.log('3: Enviar paraula');
  console.log('4: Sortir');

  rl.question('Introdueix el número de la teva elecció: ', (input) => {
    switch (input) {
      case '1':
        socket.emit('TEMPS_PER_INICI');
        break;
      case '2':
        altaAPartida();
        break;
      case '3':
        enviarParaula();
        break;
      case '4':
        console.log('Sortint...');
        socket.disconnect();
        rl.close();
        break;
      default:
        console.log('Opció no reconeguda');
        mostrarMenu();
    }
  });
}

function altaAPartida() {
    rl.question('Introdueix la teva API_KEY: ', (apiKey) => {
      socket.emit('ALTA', { apiKey: apiKey });
    });
  };

function enviarParaula() {
  rl.question('Introdueix la paraula que vols enviar: ', (paraula) => {
    rl.question('Introdueix la teva API_KEY: ', (apiKey) => {
      socket.emit('PARAULA', { paraula: paraula, API_KEY: apiKey });
    });
  });
}

