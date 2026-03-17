import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { randomSignal } from './services/traderService.js';

dotenv.config();
await connectDB();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN || '*' } });

io.on('connection', (socket) => {
  socket.emit('trade:welcome', { message: 'Connected to CryptoPilot AI trade stream' });
});

setInterval(() => {
  io.emit('trade:update', randomSignal());
}, 8000);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
