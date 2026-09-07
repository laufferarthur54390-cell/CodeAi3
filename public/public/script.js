const form = document.getElementById("chatForm");
const promptInput = document.getElementById("prompt");
const chat = document.getElementById("chat");

form.addEventListener("submit", async (event) => {

  event.preventDefault();

  const prompt = promptInput.value.trim();

  if (!prompt) {
    return;
  }

  addUserMessage(prompt);

  promptInput.value = "";

  try {

    const response = await fetch("/api/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        prompt: prompt
      })

    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Une erreur est survenue."
      );
    }

    addCodeMessage(
      data.message,
      data.code
    );

  } catch (error) {

    addErrorMessage(error.message);

  }

});


function addUserMessage(text) {

  const message = document.createElement("div");

  message.className = "message user";

  const title = document.createElement("strong");

  title.textContent = "Toi :";

  const content = document.createElement("p");

  content.textContent = text;

  message.appendChild(title);
  message.appendChild(content);

  chat.appendChild(message);

  scrollToBottom();
}


function addCodeMessage(messageText, code) {

  const message = document.createElement("div");

  message.className = "message";


  const title = document.createElement("strong");

  title.textContent = "CodeAI :";


  const text = document.createElement("p");

  text.textContent = messageText;


  const pre = document.createElement("pre");

  pre.textContent = code;


  const button = document.createElement("button");

  button.className = "copy-button";

  button.textContent = "📋 Copier";


  button.addEventListener("click", async () => {

    try {

      await navigator.clipboard.writeText(code);

      button.textContent = "✅ Copié !";

      setTimeout(() => {

        button.textContent = "📋 Copier";

      }, 1500);

    } catch {

      button.textContent = "❌ Impossible";

    }

  });


  message.appendChild(title);

  message.appendChild(text);

  message.appendChild(pre);

  message.appendChild(button);


  chat.appendChild(message);

  scrollToBottom();
}


function addErrorMessage(text) {

  const message = document.createElement("div");

  message.className = "message";

  const title = document.createElement("strong");

  title.textContent = "Erreur :";

  const content = document.createElement("p");

  content.textContent = text;

  message.appendChild(title);

  message.appendChild(content);

  chat.appendChild(message);

  scrollToBottom();
}


function scrollToBottom() {

  chat.scrollTop = chat.scrollHeight;

}
