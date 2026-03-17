import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    walletAddress: { type: String },
    subscriptionPlan: { type: String, enum: ['free', 'pro'], default: 'free' },
    chatPromptsUsedToday: { type: Number, default: 0 },
    chatPromptDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    contacts: [
      {
        label: String,
        address: String,
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
