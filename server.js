const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

// Fichiers du site
app.use(express.static(path.join(__dirname, "public")));

// API de CodeAI
app.post("/api/chat", (req, res) => {
  const prompt = String(req.body?.prompt || "").trim();

  if (!prompt) {
    return res.status(400).json({
      error: "Écris une demande."
    });
  }

  const lowerPrompt = prompt.toLowerCase();

  let code;

  if (lowerPrompt.includes("bouton")) {
    code = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mon bouton</title>
</head>
<body>

  <button id="monBouton">Clique-moi</button>

  <script>
    document
      .getElementById("monBouton")
      .addEventListener("click", () => {
        alert("Bonjour !");
      });
  </script>

</body>
</html>`;
  } else {
    code = `// Code généré par CodeAI

function main() {
  console.log("Bonjour depuis CodeAI !");
}

main();`;
  }

  res.json({
    message: "Voici une première proposition de code :",
    code: code
  });
});

// Page principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Démarrage du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`CodeAI lancé sur le port ${PORT}`);
});
