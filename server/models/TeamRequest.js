const mongoose = require('mongoose');

const teamRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    game: {
      type: String,
      required: true,
    },
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

teamRequestSchema.index({ sender: 1, createdAt: -1 });
teamRequestSchema.index({ receiver: 1, createdAt: -1 });
teamRequestSchema.index({ sender: 1, receiver: 1, game: 1, status: 1 });

module.exports = mongoose.model('TeamRequest', teamRequestSchema);
