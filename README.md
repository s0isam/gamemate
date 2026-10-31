# GameMate

GameMate is a gaming community web app for discovering games, finding nearby players, creating squads, and coordinating with teammates. It uses a React/Vite frontend, an Express API, MongoDB, and Socket.IO.

## Features

- Register and log in with JWT authentication.
- Browse and search games by title, genre, or description, with shareable filters.
- Find gamers by game, skill, availability, and approximate distance.
- Keep nearby-player locations private; discovery shows approximate distances and illustrative map positions.
- Create squads, join them with a lobby code, manage membership, and send or respond to invitations.
- View player profiles, notifications, and squad chat.
- Switch between persistent light and dark themes in the responsive interface.

## Tech stack

- **Frontend:** React, Vite, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, Mongoose, MongoDB, Socket.IO
- **Authentication:** JWT and bcrypt

## Requirements

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas connection string

## Install

From the repository root:

```bash
npm install
npm run install:all
```

`npm run install:all` installs the client and server dependencies. Run it after cloning the repository or when dependencies need to be restored.

## Configure the server

Create `server/.env` by copying `server/.env.example`. On Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

Set the values in `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/gamemate
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
SEED_DEMO_DATA=false
DEMO_SEED_PASSWORD=replace_with_a_private_password_at_least_12_chars
```

Use your MongoDB Atlas connection string for `MONGO_URI` if the database is hosted. Keep `.env` files and secrets private; do not commit them.

The demo-seed settings are optional. Leave `SEED_DEMO_DATA=false` for normal use. `DEMO_SEED_PASSWORD` is used only when intentionally seeding demo accounts; choose a private password of at least 12 characters.

## Run locally

Start both the API and frontend from the repository root:

```bash
npm run dev
```

Or start them in separate terminals:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

The frontend is available at `http://localhost:5173` and the API health endpoint is `http://localhost:5000/api/health`.

To access the app from another device on your private LAN, open the frontend using the host computer's LAN IP address, for example `http://192.168.1.10:5173`. If Vite falls back because port 5173 is busy, use the port it prints (for example, 5174). In development, the client resolves a localhost API URL to the browser's host, and the API allows localhost and private-LAN frontend origins on Vite dev ports 5173–5179.

## Demo data

The server creates the starter game catalog automatically when its games collection is empty. Demo accounts and sample squads, notifications, and chat messages are separate and require an explicit seed command.

To seed demo data:

1. Set `SEED_DEMO_DATA=true` in `server/.env`.
2. Set `DEMO_SEED_PASSWORD` to a private password with at least 12 characters.
3. From the `server` directory, run:

   ```bash
   npm run seed:demo
   ```

The seeder is disabled in production, is safe to run repeatedly, and does not delete or replace non-demo records. Set `SEED_DEMO_DATA=false` when finished.

The demo captain account uses `demo.captain@gamemate.test` and the password configured in `DEMO_SEED_PASSWORD`.

## API overview

All API routes are prefixed with `/api`. Routes other than health, authentication registration/login, and game browsing require authentication.

| Area | Routes |
| --- | --- |
| Health | `GET /health` |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Gamers | `GET /gamers`, `GET /gamers/nearby`, `GET /gamers/me`, `GET /gamers/:id`, `PUT /gamers/profile`, `PUT /gamers/status`, `PUT /gamers/location` |
| Games | `GET /games`, `GET /games/:id` |
| Squads | `GET /teams`, `POST /teams`, `GET /teams/:id`, `POST /teams/join`, `POST /teams/:id/leave` |
| Squad requests | `GET /teams/requests`, `POST /teams/requests`, `PUT /teams/requests/:id/accept`, `PUT /teams/requests/:id/reject` |
| Notifications | `GET /notifications`, `PUT /notifications/:id/read`, `PUT /notifications/read-all` |
| Chat | `GET /chat/:teamId/messages`, `POST /chat/:teamId/messages` |

## Project structure

```text
gamemate/
├── client/              # React and Vite frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── server/              # Express API and Socket.IO server
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── socket/
├── package.json
└── README.md
```

## Production notes

- Configure a strong `JWT_SECRET`, a production MongoDB URI, and the exact frontend origin(s) in `CLIENT_URL`.
- Set `NODE_ENV=production` in the server environment. Development LAN CORS allowances do not apply in production.
- Serve the built client with an appropriate static host or web server and run the API with `npm start --prefix server`.
- Demo-data seeding is intentionally blocked in production.
