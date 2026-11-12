const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const isAllowedClientOrigin = require('./config/clientOrigin');
const authRoutes = require('./routes/authRoutes');
const gamerRoutes = require('./routes/gamerRoutes');
const gameRoutes = require('./routes/gameRoutes');
const teamRoutes = require('./routes/teamRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const socketHandler = require('./socket/socketHandler');
const seedGames = require('./utils/seedGames');

dotenv.config({ path: path.resolve(__dirname, '.env') });
require('./config/env');

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 5000);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedClientOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Client origin is not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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

connectDB()
  .then((connection) => {
    if (connection) {
      seedGames();
    }
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });

socketHandler(server);

server.listen(port, () => {
  console.log(`GameMate server running on port ${port}`);
});
