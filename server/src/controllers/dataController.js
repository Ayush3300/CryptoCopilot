import { getCryptoNews } from '../services/newsService.js';
import { getRates } from '../services/exchangeService.js';
import { randomSignal, verifiedTraders } from '../services/traderService.js';

export const news = (req, res) => {
  const { coin } = req.query;
  const items = getCryptoNews().filter((n) => (coin ? n.coin === coin : true));
  res.json({ items });
};

export const traders = (_req, res) => {
  res.json({ traders: verifiedTraders });
};

export const traderStream = (_req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  const timer = setInterval(() => {
    res.write(`data: ${JSON.stringify(randomSignal())}\n\n`);
  }, 4000);

  res.on('close', () => clearInterval(timer));
};

export const rates = (_req, res) => {
  res.json({ rates: getRates() });
};

export const profile = (req, res) => {
  res.json({
    profile: {
      name: req.user.email.split('@')[0],
      email: req.user.email,
      subscription: 'free',
      walletAddress: req.user.id?.startsWith('wallet-') ? req.user.id.replace('wallet-', '') : null,
      transactions: [],
    },
  });
};
