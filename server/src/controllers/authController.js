import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const createToken = (user) =>
  jwt.sign({ id: user._id?.toString() || user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  });

const demoUsers = [];

export const signup = async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });

  const { name, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  if (User.db.readyState === 1) {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already used' });
    const user = await User.create({ name, email, passwordHash });
    return res.json({ token: createToken(user), user: { name: user.name, email: user.email, subscriptionPlan: user.subscriptionPlan } });
  }

  if (demoUsers.find((u) => u.email === email)) return res.status(409).json({ message: 'Email already used' });
  const user = { id: `${Date.now()}`, name, email, passwordHash, subscriptionPlan: 'free' };
  demoUsers.push(user);
  return res.json({ token: createToken(user), user: { name, email, subscriptionPlan: 'free' } });
};

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });

  const { email, password } = parsed.data;
  const user = User.db.readyState === 1 ? await User.findOne({ email }) : demoUsers.find((u) => u.email === email);
  if (!user?.passwordHash) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  return res.json({
    token: createToken(user),
    user: { name: user.name, email: user.email, subscriptionPlan: user.subscriptionPlan || 'free' },
  });
};

export const metamaskLogin = async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ message: 'walletAddress required' });

  const user = { id: `wallet-${walletAddress}`, email: `${walletAddress}@wallet.local`, name: 'Wallet User', subscriptionPlan: 'free' };
  return res.json({ token: createToken(user), user });
};
