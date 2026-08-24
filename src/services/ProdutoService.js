const repository = require('../repositories/ProdutoRepository');
const Produto = require('../models/Produto');
const HttpError = require('../utils/HttpError');

function listarProdutos(filtroNome) {
  return repository.listar(filtroNome);
}

function obterProduto(id) {
  const produto = repository.buscarPorId(id);
  if (!produto) {
    throw new HttpError(404, 'não encontrado');
  }
  return produto;
}

function criarProduto(dados) {
  if (!Produto.validar(dados)) {
    throw new HttpError(400, 'Produto inválido');
  }

  const { nome, categoria, preco } = dados;
  return repository.criar({ nome, categoria, preco });
}

function atualizarProduto(id, dados) {
  obterProduto(id);

  if (!Produto.validar(dados)) {
    throw new HttpError(400, 'dados inválidos');
  }

  const { nome, categoria, preco } = dados;
  return repository.atualizar(id, { nome, categoria, preco });
}

function excluirProduto(id) {
  obterProduto(id);
  repository.excluir(id);
}

module.exports = {
  listarProdutos,
  obterProduto,
  criarProduto,
  atualizarProduto,
  excluirProduto,
};
