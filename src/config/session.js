const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');

function criarSessao() {
  return session({
    store: new SQLiteStore({
      db: 'app.db',
      dir: path.join(__dirname, '..', '..', 'database'),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30,
      httpOnly: true,
      secure: false,
    },
  });
}

module.exports = criarSessao;
