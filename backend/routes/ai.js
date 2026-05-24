const express = require('express');
const router = express.Router();
const { generateStudyPlan, getStudyTip, chat } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/generate-plan', generateStudyPlan);
router.post('/study-tip', getStudyTip);
router.post('/chat', chat);

module.exports = router;
