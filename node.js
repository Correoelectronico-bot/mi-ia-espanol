const axios = require('axios');

async function enviarMensajeAlBot(mensajeUsuario) {
  const respuesta = await axios.post('https://mi-ia-espanol-nrv0.onrender.com/', {
    mensaje: mensajeUsuario
  });
  return respuesta.data;
}
