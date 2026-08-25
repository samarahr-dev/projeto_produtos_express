jest.mock('../services/ProdutoService', () => ({
  listarProdutos: jest.fn(),
  obterProduto: jest.fn(),
  criarProduto: jest.fn(),
  atualizarProduto: jest.fn(),
  excluirProduto: jest.fn(),
}));

jest.mock('../views/produtoCsvView', () => ({
  umProduto: jest.fn(),
  lista: jest.fn(),
}));

const service = require('../services/ProdutoService');
const csvView = require('../views/produtoCsvView');
const controller = require('./ProdutoController');

function criarResposta() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
    set: jest.fn(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('lista produtos, incrementa a sessao e responde 200', () => {
  const res = criarResposta();
  const produtos = [{ id: 1, nome: 'Racao' }];
  service.listarProdutos.mockReturnValue(produtos);
  const req = { query: { nome: 'racao' }, session: { contaAcessos: 2 } };

  controller.listar(req, res, jest.fn());

  expect(req.session.contaAcessos).toBe(3);
  expect(service.listarProdutos).toHaveBeenCalledWith('racao');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(produtos);
});

test('cria produto e responde 201', () => {
  const res = criarResposta();
  const produto = { id: 1, nome: 'Racao' };
  service.criarProduto.mockReturnValue(produto);

  controller.criar({ body: { nome: 'Racao' } }, res, jest.fn());

  expect(service.criarProduto).toHaveBeenCalledWith({ nome: 'Racao' });
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(produto);
});

test('encaminha erros do service para o middleware', () => {
  const erro = new Error('falha');
  const next = jest.fn();
  service.obterProduto.mockImplementation(() => { throw erro; });

  controller.buscar({ params: { id: '9' } }, criarResposta(), next);

  expect(next).toHaveBeenCalledWith(erro);
});

test('exporta um produto como CSV', () => {
  const res = criarResposta();
  const produto = { id: 1, nome: 'Racao' };
  service.obterProduto.mockReturnValue(produto);
  csvView.umProduto.mockReturnValue('id,nome\n1,Racao');

  controller.exportarUmCsv({ params: { id: '1' } }, res, jest.fn());

  expect(service.obterProduto).toHaveBeenCalledWith(1);
  expect(res.set).toHaveBeenCalledWith('Content-Type', 'text/csv');
  expect(res.send).toHaveBeenCalledWith('id,nome\n1,Racao');
});
