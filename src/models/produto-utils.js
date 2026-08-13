function validarProduto({ nome, categoria, preco }) {
  return Boolean(
    nome &&
    categoria &&
    typeof preco === 'number' &&
    preco > 0
  );
}

module.exports = { validarProduto };