import api from './axiosWithAuth';

export async function getMessages() {
  const response = await api.get('/api/chat/messages/');
  return response.data;
}

export async function sendMessage({ text }) {
  const response = await api.post('/api/chat/messages/', {
    text,
  });

  return response.data;
}
