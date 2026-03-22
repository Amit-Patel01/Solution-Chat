const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: 'Hey there! I am using SolutionChat.' },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  archivedChats: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
