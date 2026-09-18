const { GoogleGenerativeAI } = require("@google/generative-ai");

// Asegúrate de tener configurado process.env.GEMINI_API_KEY
// (usualmente a través de dotenv en tu archivo principal de entrada)
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ Advertencia: GEMINI_API_KEY no está configurada en las variables de entorno.");
}

// Inicializar el SDK de Google Generative AI con tu API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = genAI;
