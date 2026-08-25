import { requisitar } from './http';

const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

export function loginComToken() {
  return requisitar('/login', {
    method: 'POST',
    body: JSON.stringify({ access_token: ACCESS_TOKEN }),
  });
}
