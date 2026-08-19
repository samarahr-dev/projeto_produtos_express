import { useEffect, useState } from 'react';

import { api, loginComToken } from './api';
import ProdutoForm from './components/ProdutoForm';
import ProdutoList from './components/ProdutoList';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState('');

  async function carregarProdutos(nome = '') {
    setErro('');
    try {
      const query = nome ? `?nome=${encodeURIComponent(nome)}` : '';
      const lista = await api(`/produtos${query}`);
      setProdutos(lista);
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => {
    async function iniciar() {
      try {
        await loginComToken();
      } catch (e) {
        setErro(e.message);
        return;
      }
      await carregarProdutos();
    }

    iniciar();
  }, []);

  return (
    <main className="pagina">
      <h1>Loja Pet</h1>
      {erro && <p className="erro">{erro}</p>}
      <ProdutoForm onCriado={() => carregarProdutos()} />
      <ProdutoList produtos={produtos} onAlterado={carregarProdutos} />
    </main>
  );
}

export default App;
