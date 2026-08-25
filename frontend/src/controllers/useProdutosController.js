import { useEffect, useState } from 'react';

import { loginComToken } from '../services/authService';
import {
  criarProduto,
  excluirProduto,
  listarProdutos,
} from '../services/produtoService';

export function useProdutosController() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState('');

  async function carregar(nome = '') {
    setErro('');
    try {
      const lista = await listarProdutos(nome);
      setProdutos(lista);
    } catch (e) {
      setErro(e.message);
    }
  }

  async function cadastrar(dados) {
    setErro('');
    await criarProduto(dados);
    await carregar();
  }

  async function remover(id, filtro = '') {
    setErro('');
    await excluirProduto(id);
    await carregar(filtro);
  }

  useEffect(() => {
    async function iniciar() {
      try {
        await loginComToken();
      } catch (e) {
        setErro(e.message);
        return;
      }
      await carregar();
    }

    iniciar();
  }, []);

  return { produtos, erro, carregar, cadastrar, remover };
}
