import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

/*
  Camadas do frontend (MVC no React):
  - views: só apresentação (formulário, tabela, item)
  - controllers: estado e fluxo (login, listar, cadastrar, excluir)
  - services: chamadas HTTP à API
  - models: dados de domínio (categorias, formulário vazio)
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
