
const decompose = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ error: "La propiedad 'description' es requerida y debe ser un texto válido." });
    }

    const aiResponse = await Promise.race([
      aiService.decomposeTask(description),
    ]);

    return res.status(200).json(aiResponse);

  } catch (error) {

    console.error("Error en decompose (tasks.controller):", error);
    return res.status(500).json({
      error: "Ocurrió un error interno del servidor al intentar procesar la tarea."
    });
  }
};

module.exports = {
  decompose
};
