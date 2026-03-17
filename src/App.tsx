import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { apiFetch } from './lib/api';
import { useTheme } from './context/ThemeContext';

type Tab = 'home' | 'auth' | 'chat' | 'news' | 'traders' | 'wallet' | 'exchange' | 'profile';
type NewsItem = { id: string; title: string; tag: 'Bullish' | 'Bearish'; coin: string };
type Trader = { id: string; name: string; winRate: number; pnl30d: number };
type Signal = { traderName: string; pair: string; action: 'BUY' | 'SELL'; confidence: number };

const tabs: Tab[] = ['home', 'auth', 'chat', 'news', 'traders', 'wallet', 'exchange', 'profile'];
const heroWords = ['AI Copilot', 'Trader Signals', 'Web3 Wallet', 'Smart Transfers', 'Live Insights'];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const { theme, setTheme } = useTheme();

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
      <BackgroundOrbs />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <header className="glass-nav mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
          <h1 className="brand-logo">CryptoPilot AI</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            {tabs.map((item) => (
              <button key={item} onClick={() => setTab(item)} className={`tab-btn ${tab === item ? 'tab-btn--active' : ''}`}>
                {item}
              </button>
            ))}
          </div>
          <select value={theme} onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'neon')} className="theme-select">
            <option value="dark">dark</option>
            <option value="light">light</option>
            <option value="neon">neon</option>
          </select>
        </header>

        {tab === 'home' && <Home setTab={setTab} />}
        {tab === 'auth' && <Auth />}
        {tab === 'chat' && <Chatbot />}
        {tab === 'news' && <News />}
        {tab === 'traders' && <Traders />}
        {tab === 'wallet' && <Wallet />}
        {tab === 'exchange' && <Exchange />}
        {tab === 'profile' && <Profile />}
      </div>
    </main>
  );
}

function BackgroundOrbs() {
  const orbs = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ id: i, left: `${Math.random() * 100}%`, delay: `${Math.random() * 8}s`, size: 80 + Math.random() * 150 })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {orbs.map((orb) => (
        <span key={orb.id} className="orb" style={{ left: orb.left, width: orb.size, height: orb.size, animationDelay: orb.delay }} />
      ))}
    </div>
  );
}

function Home({ setTab }: { setTab: (tab: Tab) => void }) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setWordIndex((i) => (i + 1) % heroWords.length), 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-panel rounded-3xl p-10">
      <div className="hero-grid">
        <div>
          <p className="status-pill">● Live market intelligence</p>
          <h2 className="hero-title">The most attractive and professional crypto SaaS interface to ship and win.</h2>
          <p className="hero-sub">Built with smooth transitions, premium glassmorphism, neon accents, and real product flows for trading, wallet, AI, and subscriptions.</p>
          <p className="type-loop">Now focusing: <span>{heroWords[wordIndex]}</span></p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn" onClick={() => setTab('auth')}>Get Started</button>
            <button className="btn-secondary" onClick={() => setTab('chat')}>Try AI Chat</button>
          </div>
        </div>
        <div className="feature-wall">
          {['AI Chatbot', 'Trader Signals', 'Crypto News', 'Wallet Integration', 'Exchange Rates', 'Profile + Subscription'].map((item) => (
            <div key={item} className="feature-card">{item}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Auth() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [msg, setMsg] = useState('');

  const submit = async () => {
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
      const res = await apiFetch(path, { method: 'POST', body: JSON.stringify(payload) });
      localStorage.setItem('cp_token', res.token);
      setMsg('Authenticated successfully.');
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  const metaMaskLogin = async () => {
    try {
      const eth = (window as any).ethereum;
      if (!eth) return setMsg('MetaMask not detected');
      const [walletAddress] = await eth.request({ method: 'eth_requestAccounts' });
      const res = await apiFetch('/auth/metamask', { method: 'POST', body: JSON.stringify({ walletAddress }) });
      localStorage.setItem('cp_token', res.token);
      setMsg('MetaMask login success');
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  return <div className="card space-y-2">{['name', 'email', 'password'].map((field) => (mode === 'signup' || field !== 'name') && <input key={field} className="input" type={field === 'password' ? 'password' : 'text'} placeholder={field} value={(form as any)[field]} onChange={(e)=>setForm((s)=>({ ...s, [field]: e.target.value }))} />)}<button className="btn" onClick={submit}>{mode}</button><button className="btn-secondary" onClick={()=>setMode(mode==='login'?'signup':'login')}>Switch to {mode==='login'?'signup':'login'}</button><button className="btn-secondary" onClick={metaMaskLogin}>MetaMask Login</button><p>{msg}</p></div>;
}

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [quickCommand, setQuickCommand] = useState('Send 0.01 ETH to Rahul');

  const send = async () => {
    try {
      const data = await apiFetch('/chat', { method: 'POST', body: JSON.stringify({ message: input || quickCommand }) });
      setMessages((m) => [...m, `You: ${input || quickCommand}`, `AI: ${data.response} (${data.promptsRemaining} left)`]);
      setInput('');
    } catch (e: any) {
      setMessages((m) => [...m, `Error: ${e.message}`]);
    }
  };

  return (
    <div className="card">
      <div className="h-72 space-y-2 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className="rounded bg-black/40 p-2 text-sm">{m}</div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask crypto question or command" />
        <button className="btn" onClick={send}>Send</button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-cyan-200/80">Smart transfer:</span>
        <button className="chip" onClick={() => setQuickCommand('Send 0.01 ETH to Rahul')}>Rahul</button>
        <button className="chip" onClick={() => setQuickCommand('Send 0.05 ETH to Team Wallet')}>Team Wallet</button>
      </div>
    </div>
  );
}

function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [coinFilter, setCoinFilter] = useState('ALL');

  useEffect(() => {
    const query = coinFilter === 'ALL' ? '/news' : `/news?coin=${coinFilter}`;
    apiFetch(query).then((d) => setNews(d.items));
  }, [coinFilter]);

  return (
    <>
      <div className="mb-3 flex gap-2">
        {['ALL', 'BTC', 'ETH', 'SOL'].map((coin) => (
          <button key={coin} className={`chip ${coinFilter === coin ? 'chip--active' : ''}`} onClick={() => setCoinFilter(coin)}>{coin}</button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {news.map((n) => (
          <div key={n.id} className="card">
            <p className="font-semibold">{n.title}</p>
            <span className={`mt-2 inline-block text-xs ${n.tag === 'Bullish' ? 'text-emerald-300' : 'text-rose-300'}`}>{n.coin} • {n.tag}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Traders() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [traders, setTraders] = useState<Trader[]>([]);

  useEffect(() => {
    apiFetch('/traders').then((d) => setTraders(d.traders));
    const stream = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/traders/stream`);
    stream.onmessage = (event) => setSignals((s) => [JSON.parse(event.data), ...s].slice(0, 10));
    return () => stream.close();
  }, []);

  return <div className="grid gap-4 md:grid-cols-2"><div className="card"><h3 className="mb-2 font-semibold">Verified traders</h3>{traders.map((t)=><p key={t.id}>{t.name} • Win {t.winRate}% • 30d {t.pnl30d}%</p>)}</div><div className="card"><h3 className="mb-2 font-semibold">Live signal stream</h3>{signals.map((s,i)=><p key={i} className={s.action==='BUY' ? 'text-emerald-300' : 'text-rose-300'}>{s.traderName}: {s.action} {s.pair} ({s.confidence}%)</p>)}</div></div>;
}

function Wallet() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  const connect = async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    const b = await provider.getBalance(addr);
    setAddress(addr);
    setBalance(ethers.formatEther(b));
  };

  return <div className="card"><button className="btn" onClick={connect}>Connect MetaMask</button><p className="mt-3">Address: {address}</p><p>Balance: {balance} ETH</p></div>;
}

function Exchange() {
  const [rates, setRates] = useState<Record<string, number>>({});
  useEffect(() => {
    apiFetch('/exchange/rates').then((d) => setRates(d.rates));
  }, []);

  return <div className="card space-y-2">{Object.entries(rates).map(([pair, rate]) => <div key={pair} className="flex justify-between"><span>{pair}</span><strong>{String(rate)}</strong></div>)}</div>;
}

function Profile() {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    apiFetch('/profile').then((d) => setProfile(d.profile)).catch(() => undefined);
  }, []);

  return <div className="card">{profile ? <><p>{profile.email}</p><p>Subscription: {profile.subscription}</p><p>Wallet: {profile.walletAddress || 'Not connected'}</p></> : 'Login to view profile'}</div>;
}
