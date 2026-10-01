import api from './api';

export const getMyTeams = async () => {
  const { data } = await api.get('/teams');
  return data;
};

export const sendTeamRequest = async (payload) => {
  const { data } = await api.post('/teams/requests', payload);
  return data;
};
