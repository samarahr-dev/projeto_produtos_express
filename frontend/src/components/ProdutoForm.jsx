import { useState } from 'react';

import { api } from '../api';

const formularioVazio = {
  nome: '',
  categoria: '',
  preco: '',
};

function ProdutoForm({ onCriado }) {
  const [formulario, setFormulario] = useState(formularioVazio);
  const [erro, setErro] = useState('');

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErro('');

    try {
      await api('/produtos', {
        method: 'POST',
        body: JSON.stringify({
          nome: formulario.nome,
          categoria: formulario.categoria,
          preco: Number(formulario.preco),
        }),
      });
      setFormulario(formularioVazio);
      onCriado();
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <section>
      <h2>Cadastrar produto</h2>
      <form onSubmit={enviar}>
        <label>
          Nome
          <input
            name="nome"
            value={formulario.nome}
            onChange={atualizarCampo}
            required
          />
        </label>
        <label>
          Categoria
          <input
            name="categoria"
            value={formulario.categoria}
            onChange={atualizarCampo}
            required
          />
        </label>
        <label>
          Preço
          <input
            name="preco"
            type="number"
            step="0.01"
            min="0.01"
            value={formulario.preco}
            onChange={atualizarCampo}
            required
          />
        </label>
        <button type="submit">Salvar</button>
      </form>
      {erro && <p className="erro">{erro}</p>}
    </section>
  );
}

export default ProdutoForm;
