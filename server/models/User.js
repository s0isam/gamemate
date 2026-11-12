const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      default: undefined,
      validate: {
        validator: (coordinates) => (
          Array.isArray(coordinates)
          && coordinates.length === 2
          && coordinates[0] >= -180
          && coordinates[0] <= 180
          && coordinates[1] >= -90
          && coordinates[1] <= 90
        ),
        message: 'Location must contain valid longitude and latitude coordinates',
      },
    },
  },
  { _id: false }
);

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
    location: { type: locationSchema, default: undefined },
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
