const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();

// ✅ CORS completo (obligatorio para navegadores)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.post("/api/ia", async (req, res) => {
  const mensaje = req.body.mensaje.toLowerCase();

  // Si el usuario pregunta la fecha o el día
  if (mensaje.includes("qué día") || mensaje.includes("fecha")) {
    const fecha = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    return res.json({ respuesta: `Hoy es ${fechaFormateada}.` });
  }

  // ... aquí sigue tu llamada normal al modelo IA ...
});

app.use(express.json());

// Ruta de salud (para verificar que el backend está vivo)
app.get('/', (req, res) => {
  res.status(200).send('✅ Backend de IA en español activo. Usa POST /api/ia');
});

// Ruta de la IA
app.post('/api/ia', async (req, res) => {
  try {
    const { mensaje } = req.body;

    if (!mensaje || typeof mensaje !== 'string') {
      return res.status(400).json({ error: 'Mensaje inválido' });
    }

    // Verifica que la clave API esté configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY no está definida en Render');
      return res.status(500).json({ error: 'Error de configuración' });
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
      max_tokens: 500,
      temperature: 0.7
    });

    const respuesta = completion.data.choices[0].message.content.trim();
    res.json({ respuesta });
  } catch (error) {
    console.error('Error en /api/ia:', error.message);
    res.status(500).json({ 
      error: 'No se pudo procesar tu solicitud. Inténtalo de nuevo.'
    });
  }
});

// Puerto dinámico (obligatorio en Render)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Node.js corriendo en puerto ${PORT}`);
});
