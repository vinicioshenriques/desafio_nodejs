const express = require("express");
const server = express();

server.use(express.json());

const projetos = [];
let numeroRequests = 0;

//Middleware
server.use((req, res, next) => {
  numeroRequests++;
  console.log("Quantidade de requisições: ", numeroRequests);
  return next();
});

//Middleware para verificar se o usuário existe no array

function checkProjetoExists(req, res, next) {
  const id = req.params.id;

  const projetoExists = projetos.find(projeto => projeto.id == id);

  if (!projetoExists) {
    return res.status(400).json({ error: "Projeto não existe" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.status(200).json(projetos);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const projetoExists = projetos.find(projeto => projeto.id == id);

  if (projetoExists) {
    return res.status(400).json({ error: "Projeto já existe" });
  }
  const projeto = {
    id,
    title,
    tasks: []
  };
  projetos.push(projeto);
  return res.status(200).json(projeto);
});

server.put("/projects/:id", checkProjetoExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projeto = projetos.find(projeto => projeto.id == id);
  projeto.title = title;
  return res.status(200).json(projetos);
});

server.delete("/projects/:id", checkProjetoExists, (req, res) => {
  const { id } = req.params;
  const indexProjeto = projetos.findIndex(projeto => projeto.id == id);
  projetos.splice(indexProjeto, 1);
  return res.status(200).json({ message: "Projeto excluido" });
});

server.post("/projects/:id/tasks", checkProjetoExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Enviar o campo titulo da tarefa" });
  }

  const projeto = projetos.find(projeto => projeto.id == id);
  projeto.tasks.push(title);
  return res.status(200).json(projeto);
});

server.listen(3333);
