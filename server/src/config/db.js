import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('MONGO_URI not configured. Running in demo mode without persistence.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed, continuing in demo mode:', error.message);
  }
};
