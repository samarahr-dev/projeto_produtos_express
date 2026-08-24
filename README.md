# Loja Pet

API Express + frontend React para cadastro de produtos de pet shop. O código segue o padrão **MVC**, com camadas extras no backend (service e repository) para deixar claro o que cada arquivo faz.

- Backend: `http://localhost:3000`
- Frontend (Vite): `http://localhost:5173`

## Como executar

Na raiz do repositório, crie um `.env` com pelo menos:

```env
PORT=3000
SESSION_SECRET=seu_segredo
ACCESS_TOKEN=seu_token
FRONTEND_ORIGIN=http://localhost:5173
```

No frontend, copie `frontend/.env.example` para `frontend/.env` e use o mesmo token:

```env
VITE_ACCESS_TOKEN=seu_token
```

Instale e suba as duas partes:

```bash
npm install
npm start
```

```bash
cd frontend
npm install
npm run dev
```

Testes do model:

```bash
npm test
```

---

## O que é MVC neste projeto

**Model** descreve os dados e as regras do domínio.  
**View** apresenta o resultado (JSON/CSV no backend; telas no React).  
**Controller** recebe a intenção do usuário (HTTP ou clique), pede o trabalho ao model/service e devolve a resposta para a view.

Rotas, services e repositories **não substituem** o MVC: eles organizam o caminho até o controller e o model.

```
usuário → rota/view → controller → service/model → repository (banco)
                ↑________________ resposta _________________|
```

---

## Backend (`src/`)

```
src/
  app.js                 # monta o Express (CORS, sessão, rotas, erros)
  config/                # banco SQLite e sessão
  routes/                # URL + método HTTP → controller
  controllers/           # interpreta o request e escolhe a resposta
  views/                 # formatação CSV
  services/              # regras de negócio
  models/                # entidade Produto e validação
  repositories/          # SQL
  middlewares/           # login, 404, erros
  utils/                 # HttpError
server.js                # sobe o servidor na porta
```

| Pasta | Papel no MVC | Faz | Não faz |
| --- | --- | --- | --- |
| `routes/` | entrada HTTP | Liga `/api/produtos` ao `ProdutoController` | Regra de negócio, SQL, HTML |
| `controllers/` | **Controller** | Lê `req`, chama o service, define status e corpo | Validar produto, montar SQL |
| `views/` | **View** | Monta o CSV do produto | Acessar o banco |
| `models/` | **Model** | Categorias e `validar()` | Falar com Express |
| `services/` | Model (casos de uso) | “Criar só se for válido”, “404 se não existir” | Escrever `res.json` |
| `repositories/` | Model (persistência) | `SELECT` / `INSERT` / `UPDATE` / `DELETE` | Decidir se o produto é válido |
| `middlewares/` | apoio | Sessão, exige login, tratamento de erro | Cadastro de produto |

Fluxo de um `POST /api/produtos`:

1. `routes/produtoRoutes.js` chama `ProdutoController.criar`
2. O controller passa `req.body` para `ProdutoService.criarProduto`
3. O service usa `models/Produto.validar` e, se estiver ok, o `ProdutoRepository.criar`
4. O controller responde `201` com o JSON (a “view” da API)

O JSON sai no próprio controller. O CSV fica em `views/produtoCsvView.js` porque é outra forma de apresentar os mesmos dados.

---

## Frontend (`frontend/src/`)

No React não existe `req`/`res`. O equivalente é: **view** desenha a tela, **controller** (hook) guarda estado e reage a ações, **service** fala com a API, **model** guarda constantes do domínio.

```
frontend/src/
  App.jsx                          # encaixa controller + views
  views/                           # só apresentação
    ProdutoForm.jsx
    ProdutoList.jsx
    ProdutoItem.jsx
  controllers/
    useProdutosController.js       # login, listar, cadastrar, excluir
  services/                        # HTTP
    http.js
    authService.js
    produtoService.js
  models/
    produto.js                     # categorias e formulário vazio
```

| Pasta | Papel no MVC | Faz | Não faz |
| --- | --- | --- | --- |
| `views/` | **View** | Formulário, tabela, botão excluir | `fetch` / saber a URL da API |
| `controllers/` | **Controller** | Estado (`produtos`, `erro`) e fluxo | SQL, layout de cada input |
| `services/` | acesso ao model remoto | `GET/POST/DELETE` em `/api` | Controlar o React |
| `models/` | **Model** (cliente) | Lista de categorias | Chamada HTTP |

Fluxo ao clicar em **Salvar**:

1. `ProdutoForm` (view) chama `onCadastrar` com os campos
2. `useProdutosController` chama `produtoService.criarProduto`
3. O service usa `http.js` contra `http://localhost:3000/api`
4. O controller recarrega a lista e a view só re-renderiza os dados novos

`App.jsx` não contém regra de negócio: só liga o hook às views.

---

## API (resumo)

| Método | Caminho | Função |
| --- | --- | --- |
| `POST` | `/api/login` | Inicia sessão com `access_token` |
| `GET` | `/api/produtos` | Lista (query `?nome=` filtra) |
| `GET` | `/api/produtos/:id` | Busca um produto |
| `POST` | `/api/produtos` | Cria |
| `PUT` | `/api/produtos/:id` | Atualiza |
| `DELETE` | `/api/produtos/:id` | Remove |
| `GET` | `/api/produtos/csv` | Exporta todos em CSV |
| `GET` | `/api/status` | Health check |

A pasta `public/` ainda tem uma página HTML estática antiga da API. A interface da disciplina é o app em `frontend/`.
