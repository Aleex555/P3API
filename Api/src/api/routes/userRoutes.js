const express = require('express');
const router = express.Router();
// Importa el controlador
const { getAllUsers } = require('../controllers/userController');

// Utilitza el controlador per a la ruta que llista tots els usuaris
router.get('/users', getAllUsers);

module.exports = router;
