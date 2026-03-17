const suggestions = [
  'BTC trend is consolidating near resistance. Consider DCA entries.',
  'ETH gas is moderate; ideal window for wallet operations.',
  'Macro sentiment is risk-on. Watch altcoins with high volume breakouts.',
];

export const getAIResponse = async (message) => {
  const lowered = message.toLowerCase();
  if (lowered.includes('send') && lowered.includes('eth')) {
    return 'I can help draft that transfer. Confirm recipient mapping and wallet connection first.';
  }

  return suggestions[Math.floor(Math.random() * suggestions.length)];
};
