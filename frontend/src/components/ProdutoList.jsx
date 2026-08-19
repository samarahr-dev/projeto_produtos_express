import { useState } from 'react';

import { api } from '../api';

function ProdutoList({ produtos, onAlterado }) {
  const [filtro, setFiltro] = useState('');
  const [erro, setErro] = useState('');

  async function buscar(evento) {
    evento.preventDefault();
    setErro('');
    onAlterado(filtro);
  }

  async function excluir(id) {
    setErro('');
    try {
      await api(`/produtos/${id}`, { method: 'DELETE' });
      onAlterado(filtro);
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <section>
      <h2>Produtos</h2>
      <form onSubmit={buscar}>
        <label>
          Filtrar por nome
          <input
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </label>
        <button type="submit">Buscar</button>
      </form>
      {erro && <p className="erro">{erro}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.id}</td>
              <td>{produto.nome}</td>
              <td>{produto.categoria}</td>
              <td>{Number(produto.preco).toFixed(2)}</td>
              <td>
                <button type="button" onClick={() => excluir(produto.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ProdutoList;
