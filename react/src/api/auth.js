import api from './axiosWithAuth';

const TOKEN_KEY = 'token';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export async function register({ username, password }) {
  const response = await api.post('/api/auth/register/', {
    username,
    password,
  });

  return response.data;
}

export async function login({ username, password }) {
  const response = await api.post('/api/auth/login/', {
    username,
    password,
  });

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/api/auth/me/');
  return response.data;
}

export async function logout() {
  const response = await api.post('/api/auth/logout/');
  return response.data;
}
