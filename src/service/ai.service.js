const genAI = require('../config/gemini');

/**
 * Recibe una descripción de una tarea grande y la divide en microtareas
 * usando el modelo Gemini de Google (gemini-1.5-flash).
 *
 * @param {string} taskDescription La descripción de la tarea a dividir.
 * @returns {Promise<Object>} Un objeto JSON con el formato { "microtasks": [...] }
 */
const decomposeTask = async (taskDescription) => {
  // Inicializamos el modelo configurándolo para retornar exclusivamente JSON
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    // Instrucciones a nivel de sistema para guiar el comportamiento
    systemInstruction: "Eres un experto asistente de productividad. Tu objetivo es tomar tareas grandes o complejas y dividirlas en pequeños pasos accionables (microtareas). Tu respuesta DEBE ser únicamente un JSON válido.",
    generationConfig: {
      // Forzar la salida a JSON (requiere modelo gemini-1.5-flash o gemini-1.5-pro)
      responseMimeType: "application/json",
      // Definimos un schema para asegurar la estructura estricta solicitada
      responseSchema: {
        type: "object",
        properties: {
          microtasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Título corto y directo de la microtarea"
                },
                description: {
                  type: "string",
                  description: "Explicación detallada y accionable de este paso"
                }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["microtasks"]
      }
    }
  });

  // Construimos el prompt usando la entrada del usuario
  const prompt = `Por favor, desglosa la siguiente tarea en pasos más pequeños y manejables:\n\n"${taskDescription}"`;

  // Solicitamos a Gemini que procese el contenido
  const result = await model.generateContent(prompt);
  const textResponse = result.response.text();

  // Parseamos la respuesta ya que tenemos garantizado (por responseMimeType y responseSchema)
  // que nos devolverá el texto del JSON estructurado.
  return JSON.parse(textResponse);
};

module.exports = {
  decomposeTask
};
