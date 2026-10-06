const mongoose = require('mongoose');
const crypto = require('crypto');

const teamSchema = new mongoose.Schema(
  {
    game: {
      type: String,
      required: true,
    },
    lobbyCode: {
      type: String,
      default: () => crypto.randomBytes(5).toString('hex').toUpperCase(),
      unique: true,
      sparse: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxPlayers: {
      type: Number,
      default: 4,
    },
    status: {
      type: String,
      enum: ['active', 'full', 'closed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
