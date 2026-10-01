const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: String,
    age: Number,
    games: [String],
    preferredLanguages: [String],
    microphoneAvailable: {
      type: Boolean,
      default: false,
    },
    bio: String,
    gamingStatus: {
      type: String,
      enum: ['Online', 'Looking for Team', 'In Game', 'Offline'],
      default: 'Online',
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Pro'],
      default: 'Intermediate',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
