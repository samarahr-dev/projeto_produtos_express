const API_URL = 'http://localhost:3000/api';

export async function requisitar(caminho, opcoes = {}) {
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
