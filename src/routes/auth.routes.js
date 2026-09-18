const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/auth.controller');

// Ruta de registro de usuario
// POST /api/v1/auth/register
router.post('/register', registerUser);

//Exportamos el router
module.exports = router;