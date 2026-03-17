import { ChatMessage } from '../models/ChatMessage.js';
import { User } from '../models/User.js';
import { getAIResponse } from '../services/aiService.js';

const demoUsage = new Map();

export const sendChat = async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') return res.status(400).json({ message: 'Message required' });

  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10);

  let plan = 'free';
  let used = 0;

  if (User.db.readyState === 1) {
    const user = await User.findById(userId);
    if (user) {
      plan = user.subscriptionPlan;
      if (user.chatPromptDate !== today) {
        user.chatPromptDate = today;
        user.chatPromptsUsedToday = 0;
      }
      used = user.chatPromptsUsedToday;
      if (plan === 'free' && used >= 3) return res.status(403).json({ message: 'Daily free prompt limit reached' });
      user.chatPromptsUsedToday += 1;
      await user.save();
    }
  } else {
    const count = demoUsage.get(userId) || 0;
    used = count;
    if (plan === 'free' && count >= 3) return res.status(403).json({ message: 'Daily free prompt limit reached' });
    demoUsage.set(userId, count + 1);
  }

  const response = await getAIResponse(message);

  if (ChatMessage.db.readyState === 1) {
    await ChatMessage.create([
      { userId, role: 'user', content: message },
      { userId, role: 'assistant', content: response },
    ]);
  }

  return res.json({ response, promptsRemaining: plan === 'free' ? Math.max(0, 2 - used) : 'unlimited' });
};

export const chatHistory = async (req, res) => {
  if (ChatMessage.db.readyState !== 1) return res.json({ history: [] });
  const history = await ChatMessage.find({ userId: req.user.id }).sort({ createdAt: 1 }).limit(50);
  return res.json({ history });
};
