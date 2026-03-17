export const verifiedTraders = [
  { id: 't1', name: 'NovaQuant', winRate: 72, pnl30d: 18.4 },
  { id: 't2', name: 'ChainPulse', winRate: 68, pnl30d: 14.2 },
];

export const randomSignal = () => {
  const traders = ['NovaQuant', 'ChainPulse'];
  const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'];
  const action = Math.random() > 0.5 ? 'BUY' : 'SELL';

  return {
    traderName: traders[Math.floor(Math.random() * traders.length)],
    pair: pairs[Math.floor(Math.random() * pairs.length)],
    action,
    confidence: Math.floor(70 + Math.random() * 25),
    pnlPercent: Number((Math.random() * 4).toFixed(2)),
    createdAt: new Date().toISOString(),
  };
};
