const { validar } = require('./Produto');

test('deve validar um produto correto', () => {
  const produto = {
    nome: 'Ração',
    categoria: 'alimentação',
    preco: 100,
  };

  expect(validar(produto)).toBe(true);
});

test('deve rejeitar produto sem nome', () => {
  const produto = {
    nome: '',
    categoria: 'alimentação',
    preco: 100,
  };

  expect(validar(produto)).toBe(false);
});

test('deve rejeitar preço inválido', () => {
  const produto = {
    nome: 'Ração',
    categoria: 'alimentação',
    preco: -10,
  };

  expect(validar(produto)).toBe(false);
});

test('deve rejeitar categoria fora da lista', () => {
  const produto = {
    nome: 'Ração',
    categoria: 'eletrônicos',
    preco: 100,
  };

  expect(validar(produto)).toBe(false);
});
