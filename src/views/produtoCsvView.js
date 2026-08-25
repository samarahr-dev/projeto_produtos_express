function umProduto(produto) {
  return `${produto.id},${produto.nome},${produto.preco}`;
}

function lista(produtos) {
  const cabecalho = 'id,nome,preco';
  const linhas = produtos.map(umProduto);
  return [cabecalho, ...linhas].join('\n');
}

module.exports = { umProduto, lista };
