const db = require('../config/database');

function listar(filtroNome) {
  if (filtroNome) {
    return db
      .prepare('SELECT * FROM produtos WHERE nome LIKE ? COLLATE NOCASE ORDER BY id')
      .all(`%${filtroNome}%`);
  }
  return db.prepare('SELECT * FROM produtos ORDER BY id').all();
}

function buscarPorId(id) {
  return db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
}

function criar({ nome, categoria, preco }) {
  const resultado = db
    .prepare('INSERT INTO produtos (nome, categoria, preco) VALUES (?, ?, ?)')
    .run(nome, categoria, preco);
  return buscarPorId(resultado.lastInsertRowid);
}

function atualizar(id, { nome, categoria, preco }) {
  db.prepare('UPDATE produtos SET nome = ?, categoria = ?, preco = ? WHERE id = ?')
    .run(nome, categoria, preco, id);
  return buscarPorId(id);
}

function excluir(id) {
  const resultado = db.prepare('DELETE FROM produtos WHERE id = ?').run(id);
  return resultado.changes > 0;
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
