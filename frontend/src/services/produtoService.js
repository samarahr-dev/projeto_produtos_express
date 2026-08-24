import { requisitar } from './http';

export function listarProdutos(nome = '') {
  const query = nome ? `?nome=${encodeURIComponent(nome)}` : '';
  return requisitar(`/produtos${query}`);
}

export function criarProduto({ nome, categoria, preco }) {
  return requisitar('/produtos', {
    method: 'POST',
    body: JSON.stringify({ nome, categoria, preco: Number(preco) }),
  });
}

export function excluirProduto(id) {
  return requisitar(`/produtos/${id}`, { method: 'DELETE' });
}
