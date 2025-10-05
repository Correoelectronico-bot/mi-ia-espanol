const express = require('express');
const app = express();

// CORS obligatorio para navegadores
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Ruta de salud (PARA VERIFICAR)
app.get('/', (req, res) => {
  res.send('✅ Backend activo');
});

// Ruta de la IA
app.post('/api/ia', (req, res) => {
  // Solo para prueba: responde sin OpenAI
  res.json({ respuesta: "¡Funciona! Ahora configura tu clave OpenAI en Render." });
});

app.listen(process.env.PORT || 8000);
