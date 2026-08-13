const service = require('../services/ProdutoService');

function listar(req, res) {
  req.session.contaAcessos += 1;
  const { nome } = req.query;
  res.status(200).json(service.listarProdutos(nome));
}

function buscar(req, res) {
  try {
    const produto = service.obterProduto(Number(req.params.id));
    res.status(200).json(produto);
  } catch (erro) {
    res.status(erro.status || 500).json({ erro: erro.message });
  }
}

function criar(req, res) {
  try {
    const produto = service.criarProduto(req.body);
    res.status(201).json(produto); // 201 = criado com sucesso
  } catch (erro) {
    res.status(erro.status || 500).json({ erro: erro.message });
  }
}

function atualizar(req, res) {
  try {
    const produto = service.atualizarProduto(Number(req.params.id), req.body);
    res.status(200).json(produto);
  } catch (erro) {
    res.status(erro.status || 500).json({ erro: erro.message });
  }
}

function excluir(req, res) {
  try {
    service.excluirProduto(Number(req.params.id));
    res.status(204).send(); // 204 = sucesso, sem conteúdo de resposta
  } catch (erro) {
    res.status(erro.status || 500).json({ erro: erro.message });
  }
}

// GET /api/produtos/:id/csv — exporta 1 produto
function exportarUmCsv(req, res) {
  try {
    const produto = service.obterProduto(Number(req.params.id));
    res.set('Content-Type', 'text/csv');
    res.send(`${produto.id},${produto.nome},${produto.preco}`);
  } catch (erro) {
    res.status(erro.status || 500).json({ erro: erro.message });
  }
}

// GET /api/produtos/csv — exporta todos os produtos
function exportarTodosCsv(req, res) {
  const produtos = service.listarProdutos();
  const cabecalho = 'id,nome,preco';
  const linhas = produtos.map((p) => `${p.id},${p.nome},${p.preco}`);
  res.set('Content-Type', 'text/csv');
  res.send([cabecalho, ...linhas].join('\n'));
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
