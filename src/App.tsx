import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { apiFetch } from './lib/api';
import { useTheme } from './context/ThemeContext';

type Tab = 'home' | 'auth' | 'chat' | 'news' | 'traders' | 'wallet' | 'exchange' | 'profile';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const { theme, setTheme } = useTheme();

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur">
          <h1 className="text-xl font-bold text-cyan-300">CryptoPilot AI</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            {(['home', 'auth', 'chat', 'news', 'traders', 'wallet', 'exchange', 'profile'] as Tab[]).map((item) => (
              <button key={item} onClick={() => setTab(item)} className="rounded-lg border border-white/20 px-3 py-1 capitalize">
                {item}
              </button>
            ))}
          </div>
          <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className="rounded-lg bg-black/30 px-2 py-1">
            <option value="dark">dark</option>
            <option value="light">light</option>
            <option value="neon">neon</option>
          </select>
        </header>
        {tab === 'home' && <Home />}
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

function Home() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-900/40 p-10">
      <div className="hero-bg absolute inset-0" />
      <div className="relative z-10">
        <h2 className="max-w-3xl text-5xl font-bold text-white">Futuristic crypto assistant with AI, live signals, and Web3 automation.</h2>
        <p className="mt-6 max-w-2xl text-slate-200">Includes chat limits, wallet actions, trader feed, subscription-ready backend APIs, and SSE/Socket real-time architecture.</p>
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {['AI Chatbot', 'Trader Signals', 'Crypto News', 'Wallet Integration'].map((item) => (
            <div key={item} className="rounded-xl border border-white/20 bg-black/35 p-3 text-sm text-cyan-100 backdrop-blur hover:-translate-y-1 transition">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Auth() { /* same as before */
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [msg, setMsg] = useState('');
  const submit = async () => { try { const path = mode === 'login' ? '/auth/login' : '/auth/signup'; const payload = mode === 'login' ? { email: form.email, password: form.password } : form; const res = await apiFetch(path, { method: 'POST', body: JSON.stringify(payload) }); localStorage.setItem('cp_token', res.token); setMsg('Authenticated successfully.'); } catch (e: any) { setMsg(e.message); } };
  const metaMaskLogin = async () => { try { const eth = (window as any).ethereum; if (!eth) return setMsg('MetaMask not detected'); const [walletAddress] = await eth.request({ method: 'eth_requestAccounts' }); const res = await apiFetch('/auth/metamask', { method: 'POST', body: JSON.stringify({ walletAddress }) }); localStorage.setItem('cp_token', res.token); setMsg('MetaMask login success'); } catch (e: any) { setMsg(e.message); } };
  return <div className="card space-y-2">{['name', 'email', 'password'].map((field) => (mode === 'signup' || field !== 'name') && <input key={field} className="input" type={field === 'password' ? 'password' : 'text'} placeholder={field} value={(form as any)[field]} onChange={(e)=>setForm((s)=>({ ...s, [field]: e.target.value }))} />)}<button className="btn" onClick={submit}>{mode}</button><button className="btn-secondary" onClick={()=>setMode(mode==='login'?'signup':'login')}>Switch to {mode==='login'?'signup':'login'}</button><button className="btn-secondary" onClick={metaMaskLogin}>MetaMask Login</button><p>{msg}</p></div>;
}

function Chatbot() { const [input, setInput] = useState(''); const [messages, setMessages] = useState<string[]>([]); const send = async () => { try { const data = await apiFetch('/chat', { method: 'POST', body: JSON.stringify({ message: input }) }); setMessages((m) => [...m, `You: ${input}`, `AI: ${data.response} (${data.promptsRemaining} left)`]); setInput(''); } catch (e: any) { setMessages((m) => [...m, `Error: ${e.message}`]); } }; return <div className="card"><div className="h-72 overflow-auto space-y-2">{messages.map((m,i)=><div key={i} className="rounded bg-black/40 p-2 text-sm">{m}</div>)}</div><div className="mt-3 flex gap-2"><input className="input" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask crypto question or send command"/><button className="btn" onClick={send}>Send</button></div></div>; }
function News() { const [news, setNews] = useState<any[]>([]); useEffect(() => { apiFetch('/news').then((d) => setNews(d.items)); }, []); return <div className="grid gap-3 md:grid-cols-2">{news.map((n)=><div key={n.id} className="card"><p className="font-semibold">{n.title}</p><span className="text-xs text-cyan-300">{n.coin} • {n.tag}</span></div>)}</div>; }
function Traders() { const [signals, setSignals] = useState<any[]>([]); const [traders, setTraders] = useState<any[]>([]); useEffect(() => { apiFetch('/traders').then((d) => setTraders(d.traders)); const stream = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/traders/stream`); stream.onmessage = (event) => setSignals((s) => [JSON.parse(event.data), ...s].slice(0, 10)); return () => stream.close(); }, []); return <div className="grid gap-4 md:grid-cols-2"><div className="card"><h3 className="mb-2 font-semibold">Verified traders</h3>{traders.map((t)=><p key={t.id}>{t.name} • Win {t.winRate}% • 30d {t.pnl30d}%</p>)}</div><div className="card"><h3 className="mb-2 font-semibold">Live signal stream</h3>{signals.map((s,i)=><p key={i}>{s.traderName}: {s.action} {s.pair} ({s.confidence}%)</p>)}</div></div>; }
function Wallet() { const [address, setAddress] = useState(''); const [balance, setBalance] = useState(''); const connect = async () => { const provider = new ethers.BrowserProvider((window as any).ethereum); const signer = await provider.getSigner(); const addr = await signer.getAddress(); const b = await provider.getBalance(addr); setAddress(addr); setBalance(ethers.formatEther(b)); }; return <div className="card"><button className="btn" onClick={connect}>Connect MetaMask</button><p className="mt-3">Address: {address}</p><p>Balance: {balance} ETH</p></div>; }
function Exchange() { const [rates, setRates] = useState<any>({}); useEffect(() => { apiFetch('/exchange/rates').then((d) => setRates(d.rates)); }, []); return <div className="card space-y-2">{Object.entries(rates).map(([pair, rate]) => <div key={pair} className="flex justify-between"><span>{pair}</span><strong>{String(rate)}</strong></div>)}</div>; }
function Profile() { const [profile, setProfile] = useState<any>(null); useEffect(() => { apiFetch('/profile').then((d) => setProfile(d.profile)).catch(() => undefined); }, []); return <div className="card">{profile ? <><p>{profile.email}</p><p>Subscription: {profile.subscription}</p><p>Wallet: {profile.walletAddress || 'Not connected'}</p></> : 'Login to view profile'}</div>; }
