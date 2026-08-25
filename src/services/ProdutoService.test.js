jest.mock('../repositories/ProdutoRepository', () => ({
  listar: jest.fn(),
  buscarPorId: jest.fn(),
  criar: jest.fn(),
  atualizar: jest.fn(),
  excluir: jest.fn(),
}));

jest.mock('../models/Produto', () => ({ validar: jest.fn() }));

const repository = require('../repositories/ProdutoRepository');
const Produto = require('../models/Produto');
const service = require('./ProdutoService');
const HttpError = require('../utils/HttpError');

const dados = { nome: 'Racao', categoria: 'alimentação', preco: 100 };

beforeEach(() => {
  jest.clearAllMocks();
});

test('lista produtos aplicando o filtro recebido', () => {
  const produtos = [{ id: 1, ...dados }];
  repository.listar.mockReturnValue(produtos);

  expect(service.listarProdutos('racao')).toBe(produtos);
  expect(repository.listar).toHaveBeenCalledWith('racao');
});

test('retorna produto encontrado', () => {
  const produto = { id: 1, ...dados };
  repository.buscarPorId.mockReturnValue(produto);

  expect(service.obterProduto(1)).toBe(produto);
  expect(repository.buscarPorId).toHaveBeenCalledWith(1);
});

test('informa 404 quando o produto nao existe', () => {
  repository.buscarPorId.mockReturnValue(undefined);

  expect(() => service.obterProduto(99)).toThrow(HttpError);
  expect(() => service.obterProduto(99)).toThrow('não encontrado');
});

test('cria produto valido somente com os campos permitidos', () => {
  const produtoCriado = { id: 1, ...dados };
  Produto.validar.mockReturnValue(true);
  repository.criar.mockReturnValue(produtoCriado);

  expect(service.criarProduto({ ...dados, id: 99 })).toBe(produtoCriado);
  expect(repository.criar).toHaveBeenCalledWith(dados);
});

test('recusa criacao de produto invalido', () => {
  Produto.validar.mockReturnValue(false);

  expect(() => service.criarProduto(dados)).toThrow('Produto inválido');
  expect(repository.criar).not.toHaveBeenCalled();
});

test('atualiza produto existente e valido', () => {
  const produtoAtualizado = { id: 1, ...dados };
  repository.buscarPorId.mockReturnValue(produtoAtualizado);
  Produto.validar.mockReturnValue(true);
  repository.atualizar.mockReturnValue(produtoAtualizado);

  expect(service.atualizarProduto(1, dados)).toBe(produtoAtualizado);
  expect(repository.atualizar).toHaveBeenCalledWith(1, dados);
});

test('nao atualiza produto inexistente ou com dados invalidos', () => {
  repository.buscarPorId.mockReturnValue(undefined);

  expect(() => service.atualizarProduto(1, dados)).toThrow('não encontrado');
  expect(Produto.validar).not.toHaveBeenCalled();
  expect(repository.atualizar).not.toHaveBeenCalled();
});

test('exclui somente produtos existentes', () => {
  repository.buscarPorId.mockReturnValue({ id: 1, ...dados });

  service.excluirProduto(1);

  expect(repository.excluir).toHaveBeenCalledWith(1);
});
