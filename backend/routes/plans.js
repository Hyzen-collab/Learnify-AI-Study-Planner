const express = require('express');
const router = express.Router();
const { getPlans, createPlan, getPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect } = require('../middleware/auth');

router.use(protect); // All plan routes require login

router.get('/', getPlans);
router.post('/', createPlan);
router.get('/:id', getPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

module.exports = router;
