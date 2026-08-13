const Database = require('better-sqlite3');
const path = require('path');

const caminhoBanco = path.join(__dirname, '..', '..', 'database', 'app.db');
const db = new Database(caminhoBanco);

db.pragma('journal_mode = WAL');

// Criação da tabela de produtos, caso ainda não exista
db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    preco REAL NOT NULL
  )
`);

// Seed inicial — mesmos produtos que existiam na lista em memória.
// Só roda na primeira vez (tabela vazia), para não duplicar a cada restart.
const { total } = db.prepare('SELECT COUNT(*) AS total FROM produtos').get();
if (total === 0) {
  const inserir = db.prepare(
    'INSERT INTO produtos (nome, categoria, preco) VALUES (?, ?, ?)'
  );
  inserir.run('Ração Golden 15kg', 'alimentação', 189.9);
  inserir.run('Coleira ajustável M', 'acessório', 39.9);
  inserir.run('Areia sanitária 4kg', 'higiene', 24.5);
}

module.exports = db;
