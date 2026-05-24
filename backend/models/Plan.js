const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Plan title is required'],
    trim: true
  },
  subjects: [{
    name: String,
    examDate: Date,
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    hoursPerWeek: Number
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  aiGeneratedPlan: {
    type: String,
    default: ''
  },
  totalStudyHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
