```js
const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

// Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Fichiers du site
app.use(express.static(path.join(__dirname, "public")));

// API CodeAI
app.post("/api/chat", async (req, res) => {
  try {
    const prompt = String(req.body?.prompt || "").trim();

    if (!prompt) {
      return res.status(400).json({
        error: "Écris une demande."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "La clé Gemini n'est pas configurée sur le serveur."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: `
Tu es CodeAI, une intelligence artificielle spécialisée dans la programmation.

Ton rôle est d'aider l'utilisateur à :
- créer des sites web
- créer des applications
- écrire du HTML, CSS et JavaScript
- écrire du Python, Java, C++, etc.
- corriger des erreurs
- expliquer du code
- améliorer du code existant

Quand l'utilisateur demande du code :
1. Comprends précisément sa demande.
2. Donne une solution fonctionnelle.
3. Utilise des blocs de code Markdown.
4. Explique brièvement comment utiliser le code.
5. Si plusieurs fichiers sont nécessaires, indique clairement le nom de chaque fichier.

Réponds toujours en français sauf si l'utilisateur demande une autre langue.
`
      }
    });

    const text = response.text || "Je n'ai pas réussi à générer une réponse.";

    res.json({
      message: "Voici la réponse de CodeAI :",
      code: text
    });

  } catch (error) {

    console.error("Erreur Gemini :", error);

    res.status(500).json({
      error: "Une erreur est survenue avec l'intelligence artificielle."
    });
  }
});

// Page principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Démarrage
app.listen(PORT, "0.0.0.0", () => {
  console.log("CodeAI lancé sur le port " + PORT);
});
```
