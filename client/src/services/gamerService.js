import api from './api';

export const getNearbyGamers = async (params) => {
  const { data } = await api.get('/gamers/nearby', { params });
  return data;
};

export const getGamers = async () => {
  const { data } = await api.get('/gamers');
  return data;
};
