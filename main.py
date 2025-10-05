from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/chat')
def chat():
    msg = request.args.get('msg', '').strip()
    if not msg:
        return jsonify({"respuesta": "Por favor, envía un mensaje."})
    
    try:
        # Usamos una API pública que SÍ funciona en 2025
        r = requests.get(f"https://api.popcat.xyz/chat?msg={msg}", timeout=8)
        if r.status_code == 200:
            data = r.json()
            respuesta = data.get("response", "Lo siento, no entendí.")
            return jsonify({"respuesta": respuesta})
        else:
            return jsonify({"respuesta": "⚠️ La IA no responde. Inténtalo más tarde."})
    except Exception as e:
        return jsonify({"respuesta": "⚠️ Error de conexión. ¿Tienes internet?"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
