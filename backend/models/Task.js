const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  dueDate: Date,
  estimatedMinutes: {
    type: Number,
    default: 60
  },
  actualMinutes: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
}, { timestamps: true });

// Auto-set completedAt when task is completed
taskSchema.pre('save', function(next) {
  if (this.isModified('completed') && this.completed) {
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
