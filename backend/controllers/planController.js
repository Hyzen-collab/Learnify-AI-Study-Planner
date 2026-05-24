const Plan = require('../models/Plan');

// GET /api/plans - Get all plans for logged-in user
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans.', error: error.message });
  }
};

// POST /api/plans - Create a new plan
const createPlan = async (req, res) => {
  try {
    const { title, subjects, startDate, endDate, aiGeneratedPlan } = req.body;
    const plan = await Plan.create({
      user: req.user._id,
      title,
      subjects,
      startDate,
      endDate,
      aiGeneratedPlan
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan.', error: error.message });
  }
};

// GET /api/plans/:id - Get a single plan
const getPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found.' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan.', error: error.message });
  }
};

// PUT /api/plans/:id - Update a plan
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found.' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating plan.', error: error.message });
  }
};

// DELETE /api/plans/:id - Delete a plan
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found.' });
    res.json({ message: 'Plan deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan.', error: error.message });
  }
};

module.exports = { getPlans, createPlan, getPlan, updatePlan, deletePlan };
