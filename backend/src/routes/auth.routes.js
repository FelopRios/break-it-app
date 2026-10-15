const express = require('express');
const router = express.Router();
const { registerUser, loginTest } = require('../controllers/auth.controller');

// Ruta de prueba para Login
// GET /api/v1/auth/login
router.get('/login', loginTest);

// Ruta de registro de usuario
// POST /api/v1/auth/register
router.post('/register', registerUser);

//Exportamos el router
module.exports = router;