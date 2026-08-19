require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');

const produtoRoutes = require('./routes/produtoRoutes');
const authRoutes = require('./routes/authRoutes');
const utilRoutes = require('./routes/utilRoutes');

const app = express();

// O frontend (Vite, porta 5173) e a API (Express, porta 3000) são origens
// diferentes. credentials: true permite enviar o cookie de sessão.
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(session({
  store: new SQLiteStore({ db: 'app.db', dir: path.join(__dirname, '..', 'database') }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    secure: false,
  },
}));

app.use('/api', authRoutes);
app.use('/api', utilRoutes);
app.use('/api/produtos', produtoRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ erro: err.message || 'Erro interno do servidor' });
});

module.exports = app;
