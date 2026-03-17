# CryptoPilot AI

CryptoPilot AI is a full-stack crypto SaaS platform with AI chat, verified trader signals, wallet integration, real-time Socket.io updates, and an immersive Three.js hero experience.

## Stack
- Frontend: React + TypeScript + Tailwind + Framer Motion + React Three Fiber
- Backend: Node.js + Express (MVC) + Socket.io + JWT + Rate Limiting
- Database: MongoDB (with demo fallback when DB is not configured)
- Web3: Ethers.js + MetaMask login/connect

## Features Delivered
- Futuristic landing page with interactive 3D globe, floating crypto coins, stars, and smooth motion.
- Multi-theme UI (dark / light / neon).
- JWT auth with login/signup + MetaMask login endpoint.
- AI chatbot API with daily free prompt limit (3/day) and persisted history when MongoDB is available.
- Crypto news feed with bullish/bearish tags.
- Trader section with verified trader cards and real-time live trade notifications via Socket.io.
- Wallet section for MetaMask connect + ETH balance.
- Exchange section with live rate API (ready to plug external provider).
- Profile page with subscription status and wallet details.
- Rate-limited chat endpoint and input validation.

## Project Structure
- `src/` → frontend app
- `server/src/` → backend MVC API

## Environment
### Frontend (`.env`)
Use `.env.example`:
```bash
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

### Backend (`server/.env`)
Use `server/.env.example`:
```bash
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace-with-strong-secret
MONGO_URI=mongodb://localhost:27017/cryptopilot
```

## Run Locally
```bash
npm install
npm --prefix server install
npm run dev
```

## Production Build
```bash
npm run build
npm --prefix server run start
```

## Notes
- Without `MONGO_URI`, backend runs in demo mode with in-memory fallback.
- Payment provider (Stripe/Razorpay), advanced portfolio analytics, and PWA can be integrated into this scaffold quickly.
