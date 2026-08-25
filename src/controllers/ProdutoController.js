const service = require('../services/ProdutoService');
const csvView = require('../views/produtoCsvView');

function listar(req, res, next) {
  try {
    req.session.contaAcessos += 1;
    const { nome } = req.query;
    res.status(200).json(service.listarProdutos(nome));
  } catch (erro) {
    next(erro);
  }
}

function buscar(req, res, next) {
  try {
    const produto = service.obterProduto(Number(req.params.id));
    res.status(200).json(produto);
  } catch (erro) {
    next(erro);
  }
}

function criar(req, res, next) {
  try {
    const produto = service.criarProduto(req.body);
    res.status(201).json(produto);
  } catch (erro) {
    next(erro);
  }
}

function atualizar(req, res, next) {
  try {
    const produto = service.atualizarProduto(Number(req.params.id), req.body);
    res.status(200).json(produto);
  } catch (erro) {
    next(erro);
  }
}

function excluir(req, res, next) {
  try {
    service.excluirProduto(Number(req.params.id));
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

function exportarUmCsv(req, res, next) {
  try {
    const produto = service.obterProduto(Number(req.params.id));
    res.set('Content-Type', 'text/csv');
    res.send(csvView.umProduto(produto));
  } catch (erro) {
    next(erro);
  }
}

function exportarTodosCsv(req, res, next) {
  try {
    const produtos = service.listarProdutos();
    res.set('Content-Type', 'text/csv');
    res.send(csvView.lista(produtos));
  } catch (erro) {
    next(erro);
  }
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  excluir,
  exportarUmCsv,
  exportarTodosCsv,
};
