function ProdutoItem({ produto, onExcluir }) {
  return (
    <tr>
      <td>{produto.id}</td>
      <td>{produto.nome}</td>
      <td>{produto.categoria}</td>
      <td>{Number(produto.preco).toFixed(2)}</td>
      <td>
        <button type="button" onClick={() => onExcluir(produto.id)}>
          Excluir
        </button>
      </td>
    </tr>
  );
}

export default ProdutoItem;
