// server.js
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 8000;

// Permitir solicitudes desde tu dominio
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

app.post('/api/ia', async (req, res) => {
  try {
    const { mensaje } = req.body;
    
    // ⚠️ Tu clave API se guarda en Render como variable secreta
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: mensaje }],
      max_tokens: 300
    });

    res.json({ respuesta: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la IA" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
