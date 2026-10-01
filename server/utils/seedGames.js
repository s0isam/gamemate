const Game = require('../models/Game');

const initialGames = [
  {
    name: 'Among Us',
    image: 'A',
    description: 'Cooperative social deduction with fast, chaotic teamwork moments.',
    category: 'Party',
  },
  {
    name: 'BGMI',
    image: 'B',
    description: 'Battle royale gameplay for squad-based tactical survival.',
    category: 'Battle Royale',
  },
  {
    name: 'Free Fire',
    image: 'F',
    description: 'Quick matches and compact battles for energetic team plays.',
    category: 'Battle Royale',
  },
  {
    name: 'Valorant',
    image: 'V',
    description: 'Tactical shooters built around coordination and precision.',
    category: 'FPS',
  },
  {
    name: 'Fortnite',
    image: 'F',
    description: 'Build, loot, and survive with your ideal squad rotation.',
    category: 'Battle Royale',
  },
  {
    name: 'Minecraft',
    image: 'M',
    description: 'Creative building sessions and survival adventures with friends.',
    category: 'Sandbox',
  },
  {
    name: 'GTA V',
    image: 'G',
    description: 'Free-roam missions and open-world shenanigans with friends.',
    category: 'Open World',
  },
  {
    name: 'Call of Duty',
    image: 'C',
    description: 'Fast-paced competitive matches and objective-focused play.',
    category: 'FPS',
  },
  {
    name: 'Apex Legends',
    image: 'A',
    description: 'Hero-based tactical battle royale for coordinated squads.',
    category: 'Battle Royale',
  },
  {
    name: 'PUBG',
    image: 'P',
    description: 'High-tension survival matches for strategic squad play.',
    category: 'Battle Royale',
  },
];

const seedGames = async () => {
  try {
    const count = await Game.countDocuments();

    if (count === 0) {
      await Game.insertMany(initialGames);
      console.log('Initial games seeded successfully');
    }
  } catch (error) {
    console.error('Game seeding failed:', error.message);
  }
};

module.exports = seedGames;
