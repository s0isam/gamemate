const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid ID');
const shortText = z.string().trim().min(1).max(80);
const optionalText = z.string().trim().max(500).optional();
const textList = z.array(z.string().trim().min(1).max(60)).max(30);
const gameStatuses = ['Online', 'Looking for Team', 'In Game', 'Offline'];
const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
const username = z.string().trim().min(2).max(40);

const registrationBody = z.object({
  username,
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72).refine(
    (value) => Buffer.byteLength(value, 'utf8') <= 72,
    'Password must be at most 72 bytes'
  ),
  profileImage: z.string().max(2048).optional(),
  age: z.coerce.number().int().min(13).max(120).optional(),
  games: textList.optional(),
  preferredLanguages: textList.optional(),
  microphoneAvailable: z.boolean().optional(),
  bio: optionalText,
});

const loginBody = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});

const profileBody = z.object({
  username: username.optional(),
  profileImage: z.string().max(2048).optional(),
  age: z.coerce.number().int().min(13).max(120).optional(),
  games: textList.optional(),
  preferredLanguages: textList.optional(),
  microphoneAvailable: z.boolean().optional(),
  bio: optionalText,
  skillLevel: z.enum(skillLevels).optional(),
}).refine((value) => Object.keys(value).length > 0, 'At least one profile field is required');

const teamIdParams = z.object({ id: objectId });
const requestIdParams = z.object({ id: objectId });
const gamerIdParams = z.object({ id: objectId });
const chatParams = z.object({ teamId: objectId });

module.exports = {
  authRegister: { body: registrationBody },
  authLogin: { body: loginBody },
  gamerId: { params: gamerIdParams },
  profileUpdate: { body: profileBody },
  statusUpdate: { body: z.object({ gamingStatus: z.enum(gameStatuses) }) },
  locationUpdate: {
    body: z.object({
      latitude: z.coerce.number().min(-90).max(90),
      longitude: z.coerce.number().min(-180).max(180),
    }),
  },
  nearbyGamers: {
    query: z.object({
      game: shortText.optional(),
      radius: z.coerce.number().min(1).max(100).default(10),
      language: shortText.optional(),
      microphone: z.enum(['true', 'false']).optional(),
      skillLevel: z.enum(skillLevels).optional(),
    }),
  },
  teamCreate: {
    body: z.object({
      game: shortText,
      maxPlayers: z.coerce.number().int().min(2).max(10).default(4),
    }),
  },
  teamId: { params: teamIdParams },
  teamJoin: { body: z.object({ lobbyCode: z.string().trim().regex(/^[A-Fa-f0-9]{10}$/) }) },
  teamLeadership: {
    params: teamIdParams,
    body: z.object({ memberId: objectId }),
  },
  teamRequest: {
    body: z.object({
      receiverId: objectId,
      game: shortText,
      message: z.string().trim().max(500).optional(),
    }),
  },
  teamRequestId: { params: requestIdParams },
  chatParams: { params: chatParams },
  chatMessage: {
    params: chatParams,
    body: z.object({ text: z.string().trim().min(1).max(2000) }),
  },
  chatQuery: {
    params: chatParams,
    query: z.object({
      page: z.coerce.number().int().min(1).max(10000).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(100),
    }),
  },
  notificationId: { params: z.object({ id: objectId }) },
  gameId: { params: z.object({ id: objectId }) },
};
