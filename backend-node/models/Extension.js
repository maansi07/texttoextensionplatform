const mongoose = require('mongoose');

const extensionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  prompt: {
    type: String,
    required: true
  },
  generatedCode: {
    type: Object,
    default: {}
  },
  plan: {
    type: String,
    enum: ['starter', 'builder', 'pro'],
    default: 'starter'
  },
  zipPath: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Extension', extensionSchema);