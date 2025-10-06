const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("./server"); // agora importa o app direto

describe("API de Alunos", () => {
  const dataPath = path.join(__dirname, "alunos.json");

  beforeEach(() => {
    fs.writeFileSync(dataPath, "[]");
  });

  test("GET /api/alunos deve retornar lista vazia", async () => {
    const res = await request(app).get("/api/alunos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("POST /api/alunos deve cadastrar aluno com sucesso", async () => {
    const aluno = { rgm: "111.222", nome: "Adrian", email: "adrian@teste.com" };
    const res = await request(app).post("/api/alunos").send(aluno);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Aluno cadastrado com sucesso!");
  });

  test("POST deve falhar com RGM duplicado", async () => {
    const aluno = { rgm: "111.222", nome: "Adrian", email: "adrian@teste.com" };
    await request(app).post("/api/alunos").send(aluno);
    const res = await request(app).post("/api/alunos").send(aluno);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("RGM já cadastrado.");
  });

  test("POST deve falhar com formato de RGM incorreto", async () => {
    const aluno = { rgm: "111222", nome: "Errado", email: "errado@teste.com" };
    const res = await request(app).post("/api/alunos").send(aluno);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("RGM deve estar no formato '***.***'.");
  });
});
