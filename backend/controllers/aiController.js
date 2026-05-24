const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/generate-plan
const generateStudyPlan = async (req, res) => {
  try {
    const { subjects, startDate, endDate, hoursPerDay, studyStyle } = req.body;
    const userName = req.user.name;

    // Build a clear prompt for Gemini
    const prompt = `
You are an expert academic study planner. Create a detailed, personalized study plan for ${userName}.

STUDENT INFO:
- Subjects to study: ${subjects.map(s => `${s.name} (exam: ${s.examDate}, priority: ${s.priority})`).join(', ')}
- Study period: ${startDate} to ${endDate}
- Available hours per day: ${hoursPerDay}
- Preferred study style: ${studyStyle || 'balanced'}

Create a structured week-by-week study plan. Include:
1. A weekly breakdown with specific topics for each subject
2. Daily time allocation recommendations
3. Key milestones and revision checkpoints
4. Study techniques best suited for each subject
5. Rest and review days
6. Exam week strategy

Format the plan clearly with headings, bullet points, and be specific and actionable.
Keep it motivating and realistic. Address ${userName} directly.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const planText = result.response.text();

    res.json({ plan: planText });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ message: 'Error generating study plan.', error: error.message });
  }
};

// POST /api/ai/study-tip
const getStudyTip = async (req, res) => {
  try {
    const { subject, difficulty } = req.body;

    const prompt = `Give one specific, actionable study tip for a software engineering student studying ${subject}. 
    The student finds this ${difficulty || 'moderately'} difficult. 
    Keep it under 3 sentences, practical, and encouraging.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    res.json({ tip: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: 'Error getting study tip.', error: error.message });
  }
};

// POST /api/ai/chat
const chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userName = req.user.name;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build chat with history
    const chat = model.startChat({
      history: (history || []).map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      generationConfig: { maxOutputTokens: 500 }
    });

    const systemContext = `You are a helpful study assistant for ${userName}, a software engineering student. 
    Help with study strategies, explain concepts, and provide academic guidance. Be concise and encouraging.`;

    const result = await chat.sendMessage(`${systemContext}\n\nStudent: ${message}`);
    res.json({ reply: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: 'Error in chat.', error: error.message });
  }
};

module.exports = { generateStudyPlan, getStudyTip, chat };
