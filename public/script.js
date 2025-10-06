const form = document.getElementById("formAluno");
const lista = document.getElementById("listaAlunos");

// Carrega todos os alunos
async function carregarAlunos() {
    try {
        const res = await fetch("/api/alunos?" + Date.now()); // evita cache
        if (!res.ok) throw new Error("Erro ao buscar alunos");
        const alunos = await res.json();

        lista.innerHTML = "";
        alunos.forEach(a => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${a.rgm}</td>
        <td>${a.nome}</td>
        <td>${a.email}</td>
      `;
            lista.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}

// Evento de envio do formulário
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const rgm = document.getElementById("rgm").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    const res = await fetch("/api/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rgm, nome, email })
    });

    const data = await res.json();
    if (res.ok) {
        alert(data.message);
        form.reset();
        await carregarAlunos(); // força atualização após o cadastro
    } else {
        alert(data.error || "Erro ao cadastrar");
    }
});

// Carrega lista ao iniciar
carregarAlunos();
