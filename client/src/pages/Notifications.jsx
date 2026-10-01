import TeamRequestCard from '../components/TeamRequestCard';

const requests = [{ sender: 'Rahul', game: 'Among Us' }, { sender: 'Aisha', game: 'Valorant' }];

const Notifications = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Notifications</h1>
      <div className="space-y-4">
        {requests.map((request, index) => (
          <TeamRequestCard key={`${request.sender}-${index}`} request={request} />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
