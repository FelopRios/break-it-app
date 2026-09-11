require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Inicialización de la API de Gemini usando la variable de entorno
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("ERROR CRÍTICO: No se ha configurado la variable GEMINI_API_KEY en el archivo .env");
}
const genAI = new GoogleGenerativeAI(apiKey);

// Endpoint POST para desglosar tareas
app.post('/tasks/decompose', async (req, res) => {
    try {
        const { taskDescription } = req.body;

        // 1. Validaciones del parámetro taskDescription
        if (!taskDescription || typeof taskDescription !== 'string') {
            return res.status(400).json({
                error: "El parámetro 'taskDescription' es obligatorio y debe ser una cadena de texto."
            });
        }

        const trimmedTask = taskDescription.trim();

        if (trimmedTask.length < 5 || trimmedTask.length > 500) {
            return res.status(400).json({
                error: "La descripción de la tarea debe contener entre 5 y 500 caracteres."
            });
        }

        // 2. Definición del modelo y prompt estructurado para Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
Actúa como un asistente experto contra la procrastinación. Tu objetivo es tomar una tarea grande y dividirla en micro-tareas pequeñas, accionables y fáciles de iniciar.

Tarea del usuario: "${trimmedTask}"

REGLA CRUCIAL DE FORMATO:
Responde ÚNICAMENTE con un arreglo JSON válido. No agregues texto adicional, ni saludos, ni etiquetas de código Markdown (\`\`\`json).
Cada objeto dentro del arreglo debe tener exactamente las siguientes dos propiedades:
- "order": número secuencial de la sub-tarea (1, 2, 3...).
- "title": descripción breve y clara de la micro-tarea (cadena de texto).

Ejemplo de respuesta esperada:
[
  {"order": 1, "title": "Abrir el documento y escribir el título"},
  {"order": 2, "title": "Redactar la introducción en 3 oraciones"}
]
`;

        // 3. Llamada a la API de Gemini
        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        // Limpieza de formato por si el modelo incluye comillas de código
        const cleanedText = responseText.replace(/```json|```/g, '').trim();

        // 4. Parsing del resultado JSON
        let subtasks;
        try {
            subtasks = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Error al parsear el JSON de Gemini:", responseText);
            return res.status(500).json({
                error: "Ocurrió un error al procesar la respuesta del modelo de IA. Intenta de nuevo."
            });
        }

        // Respuesta exitosa
        return res.status(200).json({
            originalTask: trimmedTask,
            subtasks: subtasks
        });

    } catch (error) {
        // Manejo defensivo de errores
        console.error("Error en el endpoint /tasks/decompose:", error.message || error);

        return res.status(500).json({
            error: "No se pudo procesar la tarea en este momento debido a un problema con el servicio de IA.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor BFF corriendo en el puerto ${PORT}`);
});