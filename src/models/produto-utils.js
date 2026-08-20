const CATEGORIAS = [
  'alimentação',
  'acessório',
  'higiene',
  'saúde e farmácia',
  'brinquedos',
];

function validarProduto({ nome, categoria, preco }) {
  return Boolean(
    nome &&
    CATEGORIAS.includes(categoria) &&
    typeof preco === 'number' &&
    preco > 0
  );
}

module.exports = { CATEGORIAS, validarProduto };