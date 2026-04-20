require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: req.body.message }]
      })
    });

    const d = await r.json();
    if (d.choices) {
      res.json({ reply: d.choices[0].message.content });
    } else {
      res.json({ reply: "API Error: " + JSON.stringify(d) });
    }
  } catch (err) {
    res.json({ reply: "Error: " + err.message });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running!");
});