const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');

// Definición del endpoint para descomponer una tarea
// POST /tasks/decompose
router.post('/decompose', tasksController.decompose);

module.exports = router;
