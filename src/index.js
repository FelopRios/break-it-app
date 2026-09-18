require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth.routes.js');
const taskRoutes = require('./routes/tasks.routes.js');

const app = express();
// Middleware para parsear JSON
app.use(express.json());

// Montar las rutas de autenticación
app.use('/api/v1/auth', authRoutes);

// Montar las rutas de tareas
app.use('/api/v1/tasks', taskRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});