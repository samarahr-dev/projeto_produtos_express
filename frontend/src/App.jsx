import { useProdutosController } from './controllers/useProdutosController';
import GaleriaPets from './views/GaleriaPets';
import ProdutoForm from './views/ProdutoForm';
import ProdutoList from './views/ProdutoList';
import './App.css';

function App() {
  const { produtos, erro, carregar, cadastrar, remover } = useProdutosController();

  return (
    <main className="pagina">
      <h1>Loja Pet</h1>
      <div className="layout">
        <GaleriaPets />
        <div className="conteudo">
          {erro && <p className="erro">{erro}</p>}
          <ProdutoForm onCadastrar={cadastrar} />
          <ProdutoList
            produtos={produtos}
            onBuscar={carregar}
            onRemover={remover}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
