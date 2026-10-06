import api from './api';

export const getProfile = async () => {
  const { data } = await api.get('/gamers/me');
  return data;
};

export const getNearbyGamers = async (params) => {
  const { data } = await api.get('/gamers/nearby', { params });
  return data;
};

export const getGamers = async () => {
  const { data } = await api.get('/gamers');
  return data;
};

export const getGamerById = async (gamerId) => {
  const { data } = await api.get(`/gamers/${gamerId}`);
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put('/gamers/profile', payload);
  return data;
};

export const updateStatus = async (gamingStatus) => {
  const { data } = await api.put('/gamers/status', { gamingStatus });
  return data;
};

export const updateLocation = async (latitude, longitude) => {
  const { data } = await api.put('/gamers/location', { latitude, longitude });
  return data;
};
