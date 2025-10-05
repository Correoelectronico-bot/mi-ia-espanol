// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Permitir que el frontend se comunique con el backend
app.use(express.json());
app.use(express.static('public'));

// Ruta del chat: responde con un mensaje fijo (sin IA)
app.post('/api/chat', (req, res) => {
  const userMessage = req.body.message;
  console.log('📩 Mensaje del usuario:', userMessage);
  
  // Respuesta fija (¡esto SIEMPRE funciona!)
  res.json({ reply: "¡Recibido! Dijiste: " + userMessage });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
