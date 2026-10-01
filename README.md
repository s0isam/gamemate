# GameMate

GameMate is a nearby gamer matchmaking platform inspired by ride-sharing products but designed for multiplayer teams. Players can create profiles, filter players by game and preferences, send team-up requests, and coordinate around local availability.

## Features

- User registration and login with JWT authentication
- Persistent login using local storage and protected routes
- Game-aware player discovery and nearby gamer matching structure
- Team request flow with request/accept/reject workflow
- Real-time Socket.IO-ready architecture
- Responsive dark gaming UI with React + Vite + Tailwind
- MongoDB-ready schemas for users, teams, games, notifications, and chat

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- Auth: JWT, bcrypt

## Project Structure

```text
gamemate/
├── client/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
├── package.json
└── README.md
```

## Installation

From the project root:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Environment Setup

Create the backend environment file using the example:

```bash
cp server/.env.example server/.env
```

Update the values as needed:

```env
MONGO_URI=mongodb://127.0.0.1:27017/gamemate
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

## Run the app

Backend:

```bash
npm run dev --prefix server
```

Frontend:

```bash
npm run dev --prefix client
```

Root convenience script:

```bash
npm run dev
```

## API Overview

### Auth

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Gamers

- GET /api/gamers
- GET /api/gamers/nearby

### Games

- GET /api/games

### Teams and Requests

- POST /api/teams/requests
- GET /api/teams/requests

### Notifications

- GET /api/notifications

### Chat

- GET /api/chat/:teamId/messages
- POST /api/chat/:teamId/messages

## Socket.IO Events

- teamRequest
- teamRequestAccepted
- teamRequestRejected
- newMessage
- playerOnline
- playerOffline
- teamUpdated

## Known Limitations

- MongoDB is expected to run locally or in a cloud Atlas environment.
- The project currently includes the core scaffold and auth implementation; advanced matchmaking and live team flows are staged for subsequent iterations.
- Exact geolocation is intentionally not exposed to the frontend.

## Future Improvements

- Real geospatial player matching and 2dsphere queries
- Team creation and acceptance logic
- Notification channels and unread counters
- Real chat persistence and message history
- Admin seeded games catalog and profile management
- Recommendation scoring with same-game, distance, and skill weighting
