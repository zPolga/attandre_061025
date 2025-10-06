const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Caminho do arquivo de dados
const dataPath = path.join(__dirname, "alunos.json");

// Middleware
app.use(express.json());

// Função auxiliar para garantir que o arquivo existe e tem JSON válido
function getAlunos() {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, "[]");
      return [];
    }

    const data = fs.readFileSync(dataPath, "utf-8").trim();
    if (!data) return [];

    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler ou parsear alunos.json:", err);
    return [];
  }
}

// -----------------------------
// 📍 Rota GET: listar alunos
// -----------------------------
app.get("/api/alunos", (req, res) => {
  try {
    const alunos = getAlunos();
    res.json(alunos);
  } catch (err) {
    console.error("Erro no GET /api/alunos:", err);
    res.status(500).json({ error: "Erro ao obter alunos" });
  }
});

// -----------------------------
// 📍 Rota POST: cadastrar aluno
// -----------------------------
app.post("/api/alunos", (req, res) => {
  try {
    const { rgm, nome, email } = req.body;

    if (!rgm || !nome || !email)
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });

    if (!/^\d{3}\.\d{3}$/.test(rgm))
      return res.status(400).json({ error: "RGM deve estar no formato '***.***'." });

    const alunos = getAlunos();

    if (alunos.some(a => a.rgm === rgm))
      return res.status(400).json({ error: "RGM já cadastrado." });

    const novoAluno = { rgm, nome, email };
    alunos.push(novoAluno);

    fs.writeFileSync(dataPath, JSON.stringify(alunos, null, 2));

    res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro no POST /api/alunos:", err);
    res.status(500).json({ error: "Erro ao cadastrar aluno" });
  }
});

// -----------------------------
// 📦 Servir o front-end
// -----------------------------
app.use(express.static("public"));

// -----------------------------
// 🚀 Iniciar servidor
// -----------------------------
if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}

// Exporta o app para os testes (sem iniciar o servidor)
module.exports = app;
