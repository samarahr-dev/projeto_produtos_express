require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const criarSessao = require('./config/session');
const registrarRotas = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

/*
  Camadas (MVC):
  - routes: URL e método HTTP → qual controller
  - controllers: lê o request, chama o service e devolve a resposta
  - views: formatação da saída (JSON no próprio controller; CSV em views/)
  - services: regras de negócio
  - models: entidade e validação
  - repositories: acesso ao banco
  - middlewares: sessão, login, erros
*/
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(criarSessao());

registrarRotas(app);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
