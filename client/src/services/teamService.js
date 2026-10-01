import api from './api';

export const getMyTeams = async () => {
  const { data } = await api.get('/teams');
  return data;
};

export const getTeamRequests = async () => {
  const { data } = await api.get('/teams/requests');
  return data;
};

export const sendTeamRequest = async (payload) => {
  const { data } = await api.post('/teams/requests', payload);
  return data;
};

export const acceptTeamRequest = async (id) => {
  const { data } = await api.put(`/teams/requests/${id}/accept`);
  return data;
};

export const rejectTeamRequest = async (id) => {
  const { data } = await api.put(`/teams/requests/${id}/reject`);
  return data;
};

export const leaveTeam = async (teamId) => {
  const { data } = await api.post(`/teams/${teamId}/leave`);
  return data;
};
