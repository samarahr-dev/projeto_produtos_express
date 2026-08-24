import { useState } from 'react';

import ProdutoItem from './ProdutoItem';

function ProdutoList({ produtos, onBuscar, onRemover }) {
  const [filtro, setFiltro] = useState('');
  const [erro, setErro] = useState('');

  function buscar(evento) {
    evento.preventDefault();
    setErro('');
    onBuscar(filtro);
  }

  async function excluir(id) {
    setErro('');
    try {
      await onRemover(id, filtro);
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
            <ProdutoItem
              key={produto.id}
              produto={produto}
              onExcluir={excluir}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ProdutoList;
