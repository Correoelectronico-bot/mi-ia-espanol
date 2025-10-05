const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Ruta de salud
app.get('/', (req, res) => {
  if (process.env.OPENAI_API_KEY) {
    res.send('✅ IA en español activa - ' + new Date().toISOString());
  } else {
    res.send('⚠️ Clave API no configurada en Render');
  }
});

// Ruta de la IA REAL
app.post('/api/ia', async (req, res) => {
  try {
    const { mensaje } = req.body;
    if (!mensaje) return res.status(400).json({ error: 'Mensaje requerido' });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Clave API de OpenAI no configurada en Render' });
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente útil que siempre responde en español de forma clara y amable." },
        { role: "user", content: mensaje }
      ],
      max_tokens: 500
    });

    res.json({ respuesta: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al procesar tu solicitud' });
  }
});

app.listen(process.env.PORT || 8000);
