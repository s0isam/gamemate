import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import { getMyTeams } from '../services/teamService';

const Chat = () => {
  const { teamId: routeTeamId } = useParams();
  const [teamId, setTeamId] = useState(routeTeamId || '');

  useEffect(() => {
    const fetchDefaultTeam = async () => {
      if (routeTeamId) {
        setTeamId(routeTeamId);
        return;
      }

      try {
        const response = await getMyTeams();
        const firstTeam = response.data?.[0];
        if (firstTeam) {
          setTeamId(firstTeam._id);
        }
      } catch (error) {
        console.error('Unable to load team list for chat', error);
      }
    };

    fetchDefaultTeam();
  }, [routeTeamId]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Team Chat</h1>
      <ChatBox teamId={teamId} />
    </div>
  );
};

export default Chat;
