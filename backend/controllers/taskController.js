const Task = require('../models/Task');

// GET /api/tasks - Get all tasks for user
const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.plan) filter.plan = req.query.plan;
    if (req.query.completed !== undefined) filter.completed = req.query.completed === 'true';

    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks.', error: error.message });
  }
};

// POST /api/tasks - Create a task
const createTask = async (req, res) => {
  try {
    const { title, subject, description, dueDate, estimatedMinutes, priority, plan } = req.body;
    const task = await Task.create({
      user: req.user._id,
      title, subject, description, dueDate, estimatedMinutes, priority, plan
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task.', error: error.message });
  }
};

// PUT /api/tasks/:id - Update a task (also handles toggle complete)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task.', error: error.message });
  }
};

// DELETE /api/tasks/:id - Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task.', error: error.message });
  }
};

// GET /api/tasks/stats - Get task statistics
const getStats = async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user._id });
    const completed = await Task.countDocuments({ user: req.user._id, completed: true });
    const pending = total - completed;

    // Tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueToday = await Task.countDocuments({
      user: req.user._id,
      completed: false,
      dueDate: { $gte: today, $lt: tomorrow }
    });

    // Total study minutes logged
    const minutesResult = await Task.aggregate([
      { $match: { user: req.user._id, completed: true } },
      { $group: { _id: null, total: { $sum: '$actualMinutes' } } }
    ]);
    const totalMinutes = minutesResult[0]?.total || 0;

    res.json({ total, completed, pending, dueToday, totalHours: Math.round(totalMinutes / 60) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats.', error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getStats };
