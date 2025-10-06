document.addEventListener("DOMContentLoaded", function () {
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message " + sender;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function fakeBotResponse(userText) {
    // Aquí puedes integrar una API real de IA, esto es solo una simulación simple.
    return "Has dicho: \"" + userText + "\". (Aquí iría una respuesta inteligente 🤖)";
  }

  function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    userInput.value = "";
    setTimeout(() => {
      const botReply = fakeBotResponse(text);
      appendMessage(botReply, "bot");
    }, 700);
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });
});
