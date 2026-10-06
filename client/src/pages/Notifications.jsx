import { useEffect, useState } from 'react';
import TeamRequestCard from '../components/TeamRequestCard';
import { getTeamRequests, acceptTeamRequest, rejectTeamRequest } from '../services/teamService';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

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
    setFeedback('');
    try {
      await acceptTeamRequest(request._id);
      await loadRequests();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to accept this request.');
    }
  };

  const handleReject = async (request) => {
    setFeedback('');
    try {
      await rejectTeamRequest(request._id);
      await loadRequests();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to reject this request.');
    }
  };

  const incomingRequests = requests.filter(
    (request) => request.status === 'pending' && request.receiver?._id === user?._id
  );
  const sentRequests = requests.filter((request) => request.sender?._id === user?._id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Team requests</h1>
        <p className="mt-2 text-slate-400">Review invitations you’ve received and track the ones you’ve sent.</p>
      </div>
      {feedback && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{feedback}</p>}
      {loading ? (
        <div className="text-slate-300">Loading requests...</div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Received</h2>
              <p className="mt-1 text-sm text-slate-400">Accept or decline incoming team invitations.</p>
            </div>
            {incomingRequests.length === 0 ? (
              <div className="card p-5 text-slate-300">No pending invitations right now.</div>
            ) : incomingRequests.map((request) => (
              <TeamRequestCard key={request._id} request={request} onAccept={handleAccept} onReject={handleReject} />
            ))}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Sent</h2>
              <p className="mt-1 text-sm text-slate-400">Keep track of your outgoing requests.</p>
            </div>
            {sentRequests.length === 0 ? (
              <div className="card p-5 text-slate-300">You haven’t sent any requests yet.</div>
            ) : sentRequests.map((request) => (
              <TeamRequestCard key={request._id} request={request} direction="outgoing" showActions={false} />
            ))}
          </section>
        </div>
      )}
    </div>
  );
};

export default Notifications;
