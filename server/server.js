const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const gamerRoutes = require('./routes/gamerRoutes');
const gameRoutes = require('./routes/gameRoutes');
const teamRoutes = require('./routes/teamRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const socketHandler = require('./socket/socketHandler');
const seedGames = require('./utils/seedGames');

dotenv.config({ path: './.env' });

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GameMate server is running',
    data: { status: 'healthy' },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/gamers', gamerRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

connectDB().then((connection) => {
  if (connection) {
    seedGames();
  }
});
socketHandler(server);

server.listen(port, () => {
  console.log(`GameMate server running on port ${port}`);
});
