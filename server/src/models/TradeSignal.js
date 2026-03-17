import mongoose from 'mongoose';

const tradeSignalSchema = new mongoose.Schema(
  {
    traderName: String,
    pair: String,
    action: { type: String, enum: ['BUY', 'SELL'] },
    confidence: Number,
    pnlPercent: Number,
  },
  { timestamps: true }
);

export const TradeSignal = mongoose.models.TradeSignal || mongoose.model('TradeSignal', tradeSignalSchema);
