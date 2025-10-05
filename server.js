const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();

// ✅ CORS COMPLETO (obligatorio para Render + navegador)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Ruta de salud
app.get('/', (req, res) => {
  res.send('✅ Backend activo. Usa POST /api/ia');
});

// Ruta de la IA
app.post('/api/ia', async (req, res) => {
  try {
    const { mensaje } = req.body;
    if (!mensaje) return res.status(400).json({ error: 'Mensaje requerido' });

    // Verifica clave API
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Clave API no configurada' });
    }

    const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Responde siempre en español de forma clara y amable." },
        { role: "user", content: mensaje }
      ],
      max_tokens: 400
    });

    res.json({ respuesta: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(process.env.PORT || 8000);
