import api from './api';

export const getTeamMessages = async (teamId) => {
  const { data } = await api.get(`/chat/${teamId}/messages`);
  return data;
};

export const sendTeamMessage = async (teamId, text) => {
  const { data } = await api.post(`/chat/${teamId}/messages`, { text });
  return data;
};
