import api from './api';

export const getGames = async () => {
  const { data } = await api.get('/games');
  return data;
};
