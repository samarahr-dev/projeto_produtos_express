const repository = require('../repositories/ProdutoRepository');
const { validarProduto } = require('../models/produto-utils');

function listarProdutos(filtroNome) {
  return repository.listar(filtroNome);
}

function obterProduto(id) {
  const produto = repository.buscarPorId(id);
  if (!produto) {
    const erro = new Error('não encontrado');
    erro.status = 404;
    throw erro;
  }
  return produto;
}

function criarProduto(dados) {
  if (!validarProduto(dados)) {
    const erro = new Error('Produto inválido');
    erro.status = 400;
    throw erro;
  }

  const { nome, categoria, preco } = dados;
  return repository.criar({ nome, categoria, preco });
}

function atualizarProduto(id, dados) {
  obterProduto(id); // garante que existe (senão lança 404)

  if (!validarProduto(dados)) {
    const erro = new Error('dados inválidos');
    erro.status = 400;
    throw erro;
  }

  const { nome, categoria, preco } = dados;

  return repository.atualizar(id, { nome, categoria, preco });
}

function excluirProduto(id) {
  obterProduto(id); // garante que existe (senão lança 404)
  repository.excluir(id);
}

module.exports = {
  listarProdutos,
  obterProduto,
  criarProduto,
  atualizarProduto,
  excluirProduto,
};
