const aiService = require('../service/ai.service');

/**
 * Controlador para POST /tasks/decompose
 * Recibe una descripción de la tarea y la envía a Gemini.
 * Posee un timeout de 15 segundos para evitar colgar la petición.
 */
const decompose = async (req, res) => {
  try {
    const { description } = req.body;

    // Validación básica
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ error: "La propiedad 'description' es requerida y debe ser un texto válido." });
    }

    // Promesa de timeout: se rechaza a los 15 segundos (15000ms)
    // const timeoutPromise = new Promise((_, reject) => {
    //   setTimeout(() => {
    //     reject(new Error('TIMEOUT_EXCEEDED'));
    //   }, 15000);
    // });

    // Promise.race compite entre la llamada a la IA y el timeout
    const aiResponse = await Promise.race([
      aiService.decomposeTask(description),
      // timeoutPromise
    ]);

    // Si Gemini responde antes del timeout, devolvemos el JSON al cliente
    return res.status(200).json(aiResponse);

  } catch (error) {
    // Manejo específico del Timeout
    // if (error.message === 'TIMEOUT_EXCEEDED') {
    //   return res.status(504).json({
    //     error: "Tiempo de espera agotado. El servicio de IA tardó más de 15 segundos en responder."
    //   });
    // }

    // Manejo de errores generales (ej. API Key inválida, JSON malformado de Gemini, etc.)
    console.error("Error en decompose (tasks.controller):", error);
    return res.status(500).json({
      error: "Ocurrió un error interno del servidor al intentar procesar la tarea."
    });
  }
};

module.exports = {
  decompose
};
