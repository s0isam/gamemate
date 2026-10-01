import api from './api';

export const getNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data;
};

export const markNotificationsRead = async () => {
  const { data } = await api.put('/notifications/read-all');
  return data;
};
