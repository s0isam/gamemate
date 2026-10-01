const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    description: String,
    category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
