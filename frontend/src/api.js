// O Vite (porta 5173) e o Express (porta 3000) são origens diferentes.
// Por isso o backend precisa de CORS e o fetch precisa de credentials: 'include'
// para enviar o cookie de sessão.
const API_URL = 'http://localhost:3000/api';
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

export async function api(caminho, opcoes = {}) {
  const { headers, ...resto } = opcoes;

  const resposta = await fetch(`${API_URL}${caminho}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...resto,
  });

  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(dados?.erro || 'Erro na requisição');
  }

  return dados;
}

export function loginComToken() {
  return api('/login', {
    method: 'POST',
    body: JSON.stringify({ access_token: ACCESS_TOKEN }),
  });
}
