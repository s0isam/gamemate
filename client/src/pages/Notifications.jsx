import { useEffect, useState } from 'react';
import TeamRequestCard from '../components/TeamRequestCard';
import { getTeamRequests, acceptTeamRequest, rejectTeamRequest } from '../services/teamService';

const Notifications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);

    try {
      const response = await getTeamRequests();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Unable to load requests', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (request) => {
    try {
      await acceptTeamRequest(request._id);
      loadRequests();
    } catch (error) {
      console.error('Unable to accept request', error);
    }
  };

  const handleReject = async (request) => {
    try {
      await rejectTeamRequest(request._id);
      loadRequests();
    } catch (error) {
      console.error('Unable to reject request', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Notifications</h1>
      {loading ? (
        <div className="text-slate-300">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="card p-5 text-slate-300">No pending team requests right now.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <TeamRequestCard key={request._id} request={request} onAccept={handleAccept} onReject={handleReject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
