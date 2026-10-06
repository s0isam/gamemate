require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Game = require('../models/Game');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Team = require('../models/Team');
const TeamRequest = require('../models/TeamRequest');
const User = require('../models/User');
const seedGames = require('../utils/seedGames');

const games = [
  {
    name: 'Among Us',
    image: 'AM',
    category: 'Social Strategy',
    description: 'Quick matches, teamwork, and intense bluffing rounds.',
  },
  {
    name: 'Valorant',
    image: 'VA',
    category: 'Tactical Shooter',
    description: 'Coordinate with your squad and outplay the enemy team.',
  },
  {
    name: 'Fortnite',
    image: 'FO',
    category: 'Battle Royale',
    description: 'Build, loot, and survive with your perfect duo or squad.',
  },
  {
    name: 'BGMI',
    image: 'BG',
    category: 'Battle Arena',
    description: 'Find reliable friends for ranked pushes and scrims.',
  },
];

const demoPlayers = [
  {
    key: 'captain',
    username: 'DEMO | CAPTAIN',
    email: 'demo.captain@gamemate.test',
    games: ['Valorant', 'BGMI'],
    gamingStatus: 'Looking for Team',
    skillLevel: 'Advanced',
    microphoneAvailable: true,
    preferredLanguages: ['English'],
    bio: 'Fictional demo account for testing GameMate. This is not a real player.',
    offset: [0, 0],
  },
  {
    key: 'raven',
    username: 'DEMO | RAVEN',
    email: 'demo.raven@gamemate.test',
    games: ['Valorant'],
    gamingStatus: 'Online',
    skillLevel: 'Pro',
    microphoneAvailable: true,
    preferredLanguages: ['English', 'Hindi'],
    bio: 'Fictional demo player · Competitive Valorant · Usually on evenings.',
    offset: [0.012, 0.009],
  },
  {
    key: 'nova',
    username: 'DEMO | NOVA',
    email: 'demo.nova@gamemate.test',
    games: ['Fortnite', 'Among Us'],
    gamingStatus: 'Online',
    skillLevel: 'Intermediate',
    microphoneAvailable: true,
    preferredLanguages: ['English', 'Telugu'],
    bio: 'Fictional demo player · Casual and creative sessions.',
    offset: [-0.017, 0.013],
  },
  {
    key: 'echo',
    username: 'DEMO | ECHO',
    email: 'demo.echo@gamemate.test',
    games: ['BGMI', 'PUBG'],
    gamingStatus: 'In Game',
    skillLevel: 'Advanced',
    microphoneAvailable: true,
    preferredLanguages: ['English', 'Hindi'],
    bio: 'Fictional demo player · Squad-focused battle royale.',
    offset: [0.021, -0.011],
  },
  {
    key: 'hex',
    username: 'DEMO | HEX',
    email: 'demo.hex@gamemate.test',
    games: ['Valorant', 'Call of Duty'],
    gamingStatus: 'Online',
    skillLevel: 'Advanced',
    microphoneAvailable: false,
    preferredLanguages: ['English'],
    bio: 'Fictional demo player · Tactical FPS and ranked queues.',
    offset: [-0.025, -0.009],
  },
  {
    key: 'pulse',
    username: 'DEMO | PULSE',
    email: 'demo.pulse@gamemate.test',
    games: ['Fortnite', 'Apex Legends'],
    gamingStatus: 'Looking for Team',
    skillLevel: 'Intermediate',
    microphoneAvailable: true,
    preferredLanguages: ['English'],
    bio: 'Fictional demo player · Looking for a relaxed squad.',
    offset: [0.031, 0.015],
  },
  {
    key: 'frost',
    username: 'DEMO | FROST',
    email: 'demo.frost@gamemate.test',
    games: ['Minecraft', 'Among Us'],
    gamingStatus: 'Offline',
    skillLevel: 'Beginner',
    microphoneAvailable: false,
    preferredLanguages: ['English', 'Telugu'],
    bio: 'Fictional demo player · Building, survival, and party games.',
    offset: [-0.034, 0.024],
  },
  {
    key: 'vex',
    username: 'DEMO | VEX',
    email: 'demo.vex@gamemate.test',
    games: ['BGMI', 'Free Fire'],
    gamingStatus: 'Online',
    skillLevel: 'Pro',
    microphoneAvailable: true,
    preferredLanguages: ['English', 'Hindi'],
    bio: 'Fictional demo player · Competitive battle royale.',
    offset: [0.039, -0.022],
  },
];

const getOrCreatePlayer = async (player, demoPassword) => {
  const [longitudeOffset, latitudeOffset] = player.offset;
  const profile = {
    username: player.username,
    games: player.games,
    gamingStatus: player.gamingStatus,
    skillLevel: player.skillLevel,
    microphoneAvailable: player.microphoneAvailable,
    preferredLanguages: player.preferredLanguages,
    bio: player.bio,
    location: {
      type: 'Point',
      coordinates: [-122.4194 + longitudeOffset, 37.7749 + latitudeOffset],
    },
  };
  const passwordHash = await bcrypt.hash(
    player.key === 'captain' ? demoPassword : crypto.randomBytes(32).toString('hex'),
    10
  );
  const update = player.key === 'captain'
    ? {
      $set: { ...profile, password: passwordHash },
      $setOnInsert: { email: player.email },
    }
    : {
      $set: profile,
      $setOnInsert: { email: player.email, password: passwordHash },
    };

  return User.findOneAndUpdate({ email: player.email }, update, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
};

const upsertTeam = async ({ lobbyCode, game, leader, members }) => Team.findOneAndUpdate(
  { lobbyCode },
  {
    $set: {
      game,
      leader: leader._id,
      members: members.map((member) => member._id),
      maxPlayers: 4,
      status: 'active',
    },
  },
  { new: true, upsert: true, runValidators: true }
);

const upsertRequest = async ({ sender, receiver, game, status, message }) => TeamRequest.findOneAndUpdate(
  { sender: sender._id, receiver: receiver._id, game },
  { $set: { status, message } },
  { new: true, upsert: true, runValidators: true }
);

const addNotificationIfMissing = async ({ user, message, type }) => {
  await Notification.updateOne(
    { user: user._id, message },
    { $setOnInsert: { user: user._id, message, type, read: false } },
    { upsert: true }
  );
};

const addMessageIfMissing = async ({ team, sender, text }) => {
  await Message.updateOne(
    { team: team._id, sender: sender._id, text },
    { $setOnInsert: { team: team._id, sender: sender._id, text } },
    { upsert: true }
  );
};

const seedDemoData = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Demo data seeding is disabled in production.');
  }

  if (process.env.SEED_DEMO_DATA !== 'true') {
    throw new Error('Set SEED_DEMO_DATA=true to explicitly enable demo data seeding.');
  }

  const demoPassword = process.env.DEMO_SEED_PASSWORD;
  if (!demoPassword || demoPassword.length < 12) {
    throw new Error('Set DEMO_SEED_PASSWORD to a password with at least 12 characters.');
  }

  const connection = await connectDB();
  if (!connection) {
    throw new Error('MongoDB is unavailable; no demo data was seeded.');
  }

  try {
    await seedGames();
    await Game.bulkWrite(games.map((game) => ({
      updateOne: {
        filter: { name: game.name },
        update: { $setOnInsert: game },
        upsert: true,
      },
    })));

    const players = {};
    for (const player of demoPlayers) {
      players[player.key] = await getOrCreatePlayer(player, demoPassword);
    }

    const valorantTeam = await upsertTeam({
      lobbyCode: 'DEA0000001',
      game: 'Valorant',
      leader: players.captain,
      members: [players.captain, players.raven, players.hex],
    });
    const bgmiTeam = await upsertTeam({
      lobbyCode: 'DEA0000002',
      game: 'BGMI',
      leader: players.vex,
      members: [players.vex, players.captain, players.echo],
    });
    const fortniteTeam = await upsertTeam({
      lobbyCode: 'DEA0000003',
      game: 'Fortnite',
      leader: players.nova,
      members: [players.nova, players.pulse],
    });

    await Promise.all([
      upsertRequest({
        sender: players.raven,
        receiver: players.captain,
        game: 'Valorant',
        status: 'pending',
        message: 'Fictional demo invitation: ready for a ranked session?',
      }),
      upsertRequest({
        sender: players.captain,
        receiver: players.pulse,
        game: 'Fortnite',
        status: 'pending',
        message: 'Fictional demo invitation: want to squad up?',
      }),
      upsertRequest({
        sender: players.hex,
        receiver: players.captain,
        game: 'Valorant',
        status: 'accepted',
        message: 'Fictional demo request accepted for the seeded squad.',
      }),
      addNotificationIfMissing({
        user: players.captain,
        message: 'DEMO | RAVEN wants to team up for Valorant.',
        type: 'teamRequest',
      }),
      addNotificationIfMissing({
        user: players.captain,
        message: 'DEMO | HEX accepted your Valorant team request.',
        type: 'teamRequestAccepted',
      }),
      addMessageIfMissing({
        team: valorantTeam,
        sender: players.captain,
        text: '[DEMO] Welcome to the Valorant squad. Use this chat to coordinate.',
      }),
      addMessageIfMissing({
        team: valorantTeam,
        sender: players.raven,
        text: '[DEMO] Mic check done. Ready when everyone is.',
      }),
      addMessageIfMissing({
        team: bgmiTeam,
        sender: players.vex,
        text: '[DEMO] Lobby is open. Share the code with your squad.',
      }),
      addMessageIfMissing({
        team: fortniteTeam,
        sender: players.nova,
        text: '[DEMO] Let us build a casual squad.',
      }),
    ]);

    console.log('Demo data seeded successfully. Existing non-demo records were left untouched.');
    console.log('Demo login: demo.captain@gamemate.test');
    console.log('Password: the value supplied in DEMO_SEED_PASSWORD');
    console.log('All seeded player names and profile bios are marked DEMO.');
    console.log(`Database: ${connection.connection.name}`);
  } finally {
    await mongoose.disconnect();
  }
};

seedDemoData().catch((error) => {
  console.error(`Demo data seed failed: ${error.message}`);
  process.exitCode = 1;
});
