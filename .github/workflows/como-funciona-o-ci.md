# Como funciona o `ci.yml` (GitHub Actions)

Este texto explica o arquivo `.github/workflows/ci.yml` deste repositório. A ideia é você conseguir copiar o raciocínio para **o seu** projeto, mesmo que as pastas e os scripts sejam diferentes.

Não há deploy aqui. **CI** (Continuous Integration) só responde: “este código ainda funciona?”. **CD** (Continuous Delivery/Deploy) seria publicar em um servidor; isso fica para outro momento.

---

## 1. O que o GitHub precisa ver

O GitHub Actions procura arquivos YAML em:

```text
.github/workflows/
```

O nome do arquivo pode ser o que você quiser (`ci.yml`, `testes.yml`). O que importa é a extensão `.yml` (ou `.yaml`) e essa pasta.

Quando alguém faz **push** ou abre um **pull request**, o GitHub lê o arquivo, aluga uma máquina virtual na nuvem e executa os passos. Você vê o resultado na aba **Actions** do repositório.

No seu computador isso **não** roda sozinho. Para testar localmente, use os mesmos comandos do workflow (`npm test`, `npm run lint`, `npm run build`).

---

## 2. Leitura do arquivo, de cima para baixo

### `name`

Nome que aparece na aba Actions. Pode ser `CI`, `Testes`, `Qualidade`.

### `on`

Define **quando** o workflow dispara. Neste projeto:

- `push` na branch `main` — alguém enviou commit para a branch principal;
- `pull_request` — alguém abriu (ou atualizou) um PR.

Se o seu projeto usa `master` em vez de `main`, troque o nome da branch. Você também pode listar outras branches:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
```

### `concurrency`

Evita fila inútil. Se você empurra três commits seguidos no mesmo PR, o GitHub **cancela** a execução antiga e fica só com a mais nova. O `group` é um rótulo; o `${{ github.ref }}` faz cada branch ter o seu próprio grupo.

Em um projeto pequeno isso é opcional. Em turma, com vários pushes, economiza minutos da cota gratuita.

### `jobs`

Um **job** é um bloco que roda numa máquina. Aqui existe um só, `qualidade`, porque os passos são rápidos e o frontend depende do mesmo checkout.

Você *poderia* separar `testes` e `frontend` em dois jobs. Eles rodariam em paralelo, cada um com `npm ci` próprio. Para disciplina, um job único é mais fácil de acompanhar: se algo quebrar, a lista de steps mostra exatamente onde.

### `runs-on: ubuntu-latest`

Sistema operacional da máquina. `ubuntu-latest` é o padrão em exemplos Node. Não é o seu notebook: é uma VM limpa, toda vez.

### `steps`

Lista ordenada. Se um passo falha, os seguintes **não** rodam e o X vermelho aparece no PR.

| Passo | Comando / action | Por quê |
| --- | --- | --- |
| Checkout | `actions/checkout@v4` | Copia o código do commit para a VM |
| Node | `actions/setup-node@v4` | Instala Node 22 e cacheia `node_modules` via lockfile |
| Backend | `npm ci` | Instala o que está no `package-lock.json` da raiz |
| Testes | `npm test` | Jest do backend |
| Frontend | `npm ci --prefix frontend` | Segundo `package.json`, na pasta `frontend/` |
| Lint | `npm run lint --prefix frontend` | ESLint: problemas de estilo e regras React |
| Build | `npm run build --prefix frontend` | Vite gera `frontend/dist`. O arquivo **não é publicado**; só prova que o React **compila** |

`--prefix frontend` equivale a entrar na pasta e rodar o npm lá. Útil quando o repositório tem **dois** projetos Node (API + React).

---

## 3. `npm ci` versus `npm install`

No CI use **`npm ci`**.

- `npm install` pode alterar o lockfile e instalar versões “parecidas”.
- `npm ci` apaga `node_modules` e instala **exatamente** o lockfile. Se o `package.json` e o lockfile não baterem, o passo falha — e isso é bom: alguém esqueceu de commitar o lock.

Quem clona o repo na máquina pessoal ainda pode usar `npm install`. A pipeline, não.

---

## 4. Cache do npm

```yaml
cache: npm
cache-dependency-path: |
  package-lock.json
  frontend/package-lock.json
```

Há dois lockfiles, então os dois entram no cache. Sem `cache-dependency-path`, o `setup-node` olha só o da raiz e o frontend reinstala tudo sempre.

O cache **não** substitui `npm ci`. Ele só deixa o download mais rápido na próxima execução.

---

## 5. Como reproduzir no seu projeto

1. No GitHub, o repositório precisa existir (público ou privado). Actions vem ligado por padrão.
2. Crie `.github/workflows/ci.yml`.
3. Ajuste os comandos aos **scripts do seu** `package.json`. Se você não tem frontend, apague os passos com `--prefix frontend`. Se os testes são `npm run test:unit`, use esse nome.
4. Confirme que os scripts existem **antes** de empurrar:

```bash
npm test
npm run lint --prefix frontend
npm run build --prefix frontend
```

Se falhar na sua máquina, vai falhar no Actions também.

5. Commit, push, abra o PR (ou empurre na `main`) e abra **Actions**. Clique na execução para ver o log de cada step.

### Esqueleto mínimo (só backend)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
```

### Se o React estiver na raiz (não em `frontend/`)

Troque `--prefix frontend` por comandos na raiz, por exemplo `npm run lint` e `npm run build`, no mesmo `package.json` dos testes.

### Se o lint ainda não existe

O GitHub não inventa ESLint. Você precisa do script no `package.json` (`"lint": "eslint ."` ou equivalente) e das dependências de desenvolvimento commitadas. Sem isso, o step `npm run lint` quebra com “missing script”.

---

## 6. O que este CI **não** faz (de propósito)

- Não sobe a API na porta 3000 para o mundo.
- Não publica o `frontend/dist` na Vercel, Netlify, etc.
- Não sobe Postgres. Este projeto usa SQLite em arquivo local; os testes de backend mockam o repository e não precisam de banco na VM.

Quando a turma for para um banco de verdade, o Actions permite um bloco `services:` com a imagem `postgres`. Isso é outro exercício: a aplicação tem que **conectar** nesse host. Só colocar o container no YAML não testa nada.

---

## 7. Como ler um X vermelho

1. Abra o job que falhou.
2. Expanda o step vermelho.
3. A última linha do log costuma ser o erro do Jest, do ESLint ou do Vite — o mesmo que você veria no terminal.

Erros comuns na primeira vez:

| Sintoma | Causa típica |
| --- | --- |
| `npm ci` falha | `package-lock.json` não foi commitado ou está dessincronizado |
| `missing script: lint` | script não existe no `package.json` da pasta certa |
| Testes passam local e falham no CI | dependência de `.env` ou de arquivo que não está no git (aqui os testes Jest não precisam do `.env`) |
| Cache “estranho” | mude o lockfile; o cache se renova sozinho |

Badge no README (opcional), depois que o workflow existir na `main`:

```markdown
![CI](https://github.com/SEU_USUARIO/SEU_REPO/actions/workflows/ci.yml/badge.svg)
```

---

## 8. Checklist para a aula / para o seu repo

- [ ] Pasta `.github/workflows/` com um YAML
- [ ] `on:` cobrindo `push` e `pull_request`
- [ ] `actions/checkout` **antes** de qualquer `npm`
- [ ] Mesma versão de Node que vocês usam na disciplina (`22` neste repo)
- [ ] `npm ci` + os scripts que o grupo realmente tem
- [ ] Primeiro push feito, execução verde (ou vermelha com log entendido)

Quando esses itens estão ok, o CI passou a ser parte do fluxo: ninguém precisa lembrar de rodar os testes à mão no GitHub — a máquina faz isso a cada mudança.
