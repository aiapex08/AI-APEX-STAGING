/**
 * components/AlexBot.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * APEXA — a global voice assistant that lives on every page.
 *   • Floating mini-bot — APEXA.mp4 (black background removed) while resting
 *   • Click → opens a thin, wide, blue-glass nav card; avatar becomes APEXX.jpg
 *   • Voice stays ACTIVE the whole time the card is open — only stops on close
 *   • Whatever the user types OR says is shown; APEXA replies in text + voice
 *   • APEXA can navigate / describe every page in the app
 *
 * Brain  : reuses the existing Claude proxy at /api/anthropic/v1/messages
 * Voice  : Web Speech API (SpeechSynthesis + SpeechRecognition) — no deps
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = '/api/anthropic/v1/messages';
const MODEL   = 'claude-sonnet-4-6';

const BOT_NAME  = 'Apexa';
const USER_NAME = 'Ms. Nour';
const ACCENT    = '#5aa9ff';   // nav-blue glass accent

// Pages APEXA can navigate to / talk about.
const PAGES = [
  { path: '/',                            name: 'Home / Hub',          about: 'the main hub where you pick a department.' },
  { path: '/dashboard',                   name: '3D Dashboard',        about: 'the immersive 3D control dashboard.' },
  { path: '/sales',                       name: 'Sales',               about: 'the sales workspace and AI estimation for sales.' },
  { path: '/contracts',                   name: 'AI Contracts',        about: 'AI-assisted contracts.' },
  { path: '/estimation-hub',              name: 'Estimation Hub',      about: 'the estimation hub — your launchpad for all estimation tools.' },
  { path: '/estimation-hub/estimation',   name: 'AI Estimation',      about: 'the AI estimation tool.' },
  { path: '/estimation-hub/team-access',  name: 'Team Access',         about: 'team roles and access control.' },
  { path: '/estimation-hub/team',         name: 'Team',                about: 'the team overview.' },
  { path: '/estimation-hub/customers',    name: 'Customers',           about: 'the customers list.' },
  { path: '/estimation-hub/ai-analysis',  name: 'AI Analysis',        about: 'AI analysis and insights.' },
  { path: '/estimation-hub/costing-art',  name: 'Costing Art',         about: 'the costing workspace.' },
  { path: '/estimation-hub/project-list', name: 'Project List',        about: 'all projects.' },
  { path: '/estimation-hub/fire-door',    name: 'Fire Door Estimator', about: 'the fire-door estimator tool.' },
];

const GREETING = `Hi ${USER_NAME},\nHope you are doing great !\n\nHow can I help you today..`;

const SYSTEM_PROMPT = `You are ${BOT_NAME}, a warm, friendly female AI assistant for NAFFCO's "AI APEX" platform.
You are speaking with the user. Her name is ${USER_NAME} — address her as "${USER_NAME}", but ONLY occasionally (not in every message; over-using her name feels unnatural).
Keep every reply SHORT and conversational — 1 to 2 sentences — because your words are read aloud.

LANGUAGE: Always reply in the SAME language the user used. If the user writes or speaks in Arabic, reply ONLY in Arabic. If they use English, reply in English. Auto-switch every turn to match them.

You can navigate the app and briefly describe what each page is for. Available pages (name → path → about):
${PAGES.map(p => `- ${p.name} → ${p.path} — ${p.about}`).join('\n')}

When the user asks to go to / open / show / take them to a page, finish your reply with a tag on its own line:
[[navigate:<path>]]
Only add the tag when navigation is genuinely intended. Use only the exact paths above. Never speak the tag, never mention it.`;

// Arabic detection for voice / recognition auto-switch.
const isArabic = (t) => /[؀-ۿ]/.test(t || '');

// ─── VOICE PICKING ─────────────────────────────────────────────────────────────
function pickVoice(voices, lang) {
  if (!voices || !voices.length) return null;
  if (lang === 'ar') {
    const ar = voices.filter(v => /^ar/i.test(v.lang));
    if (ar.length) {
      const fem = ar.find(v => /female|hoda|salma|zariyah|naayf|amira/i.test(v.name));
      return fem || ar[0];
    }
    // fall through to default if no Arabic voice installed
  }
  const en = voices.filter(v => /^en/i.test(v.lang));
  const pool = en.length ? en : voices;
  const preferred = [
    'google uk english female', 'google us english',
    'samantha', 'microsoft zira', 'microsoft aria', 'fiona',
    'karen', 'tessa', 'moira', 'serena', 'female',
  ];
  for (const want of preferred) {
    const hit = pool.find(v => v.name.toLowerCase().includes(want));
    if (hit) return hit;
  }
  return pool[0];
}

export default function AlexBot() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [open, setOpen]             = useState(false);
  const [messages, setMessages]     = useState([]);     // { role:'user'|'bot', text }
  const [input, setInput]           = useState('');
  const [thinking, setThinking]     = useState(false);
  const [listening, setListening]   = useState(false);
  const [speaking, setSpeaking]     = useState(false);
  const [muted, setMuted]           = useState(false);   // TTS mute
  const [micEnabled, setMicEnabled] = useState(true);    // mic on/off

  const voicesRef  = useRef([]);
  const recogRef   = useRef(null);
  const scrollRef  = useRef(null);
  const mutedRef   = useRef(false);
  const sendRef    = useRef(() => {});
  const shouldListenRef = useRef(false);
  const langRef    = useRef('en-US');   // follows the conversation language
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // Home page → right side; other routes alternate left / right.
  const isHome  = location.pathname === '/';
  const onLeft  = !isHome && (location.pathname.length % 2) === 1;
  const sideKey = onLeft ? 'left' : 'right';

  // ── load voices ────────────────────────────────────────────────────────────
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const load = () => { voicesRef.current = synth.getVoices(); };
    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => synth.removeEventListener?.('voiceschanged', load);
  }, []);

  // ── speak ──────────────────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    const synth = window.speechSynthesis;
    if (!synth || mutedRef.current || !text) return;
    synth.cancel();
    const ar = isArabic(text);
    langRef.current = ar ? 'ar-SA' : 'en-US';   // keep recognition in sync
    const voice = pickVoice(voicesRef.current, ar ? 'ar' : 'en');
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang   = voice?.lang || (ar ? 'ar-SA' : 'en-US');
    u.rate   = ar ? 0.9 : 0.85;   // slow, gentle
    u.pitch  = 1.15;   // soft, feminine
    u.volume = 1.0;
    u.onstart = () => setSpeaking(true);   // pauses the mic (see effect) to avoid echo
    u.onend   = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.speak(u);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  // ── ask Claude ───────────────────────────────────────────────────────────────
  const ask = useCallback(async (userText) => {
    const history = [...messages, { role: 'user', text: userText }];
    const apiMessages = history.map(m => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text,
    }));
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, max_tokens: 400, system: SYSTEM_PROMPT, messages: apiMessages }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      return data.content?.find(b => b.type === 'text')?.text || "Sorry, I didn't catch that.";
    } catch (err) {
      console.warn('[APEXA] falling back:', err.message);
      return localFallback(userText);
    }
  }, [messages]);

  // Offline / no-API fallback so APEXA still navigates and chats a little.
  const localFallback = (text) => {
    const t = text.toLowerCase();
    const hit = PAGES.find(p =>
      t.includes(p.name.toLowerCase()) ||
      (p.name === 'Customers'  && t.includes('customer')) ||
      (p.name === 'AI Estimation' && t.includes('estimat')) ||
      (p.name === 'Fire Door Estimator' && t.includes('fire door')) ||
      (p.name === 'Home / Hub' && (t.includes('home') || t.includes('hub')))
    );
    if (hit && /(go|open|show|take|navigate|bring)/.test(t)) {
      return `Sure, taking you to ${hit.name}. [[navigate:${hit.path}]]`;
    }
    return `I'm right here. You can ask me to open a page — like "take me to customers" — or just chat with me.`;
  };

  // ── send a message ────────────────────────────────────────────────────────────
  const send = useCallback(async (raw) => {
    const userText = (raw ?? input).trim();
    if (!userText || thinking) return;
    if (isArabic(userText)) langRef.current = 'ar-SA';   // user typed Arabic
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setThinking(true);

    const reply = await ask(userText);

    let toNavigate = null;
    const clean = reply.replace(/\[\[navigate:([^\]]+)\]\]/i, (_, path) => {
      toNavigate = path.trim();
      return '';
    }).trim();

    setThinking(false);
    setMessages(prev => [...prev, { role: 'bot', text: clean }]);
    speak(clean);

    if (toNavigate && PAGES.some(p => p.path === toNavigate)) {
      setTimeout(() => navigate(toNavigate), 900);
    }
  }, [input, thinking, ask, speak, navigate]);
  sendRef.current = send;

  // ── continuous speech recognition (stays alive while the card is open) ──────────
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || recogRef.current) return;
    const recog = new SR();
    recog.lang = langRef.current;   // auto English / Arabic
    recog.interimResults = true;
    recog.continuous = true;
    recog.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          const t = r[0].transcript.trim();
          if (t) { setInput(''); sendRef.current(t); }
        } else interim += r[0].transcript;
      }
      if (interim) setInput(interim);
    };
    recog.onerror = () => {};
    recog.onend = () => {
      recogRef.current = null;
      setListening(false);
      if (shouldListenRef.current) startListening();   // keep it alive
    };
    recogRef.current = recog;
    try { recog.start(); setListening(true); } catch { /* already started */ }
  }, []);

  const stopListening = useCallback(() => {
    const r = recogRef.current;
    recogRef.current = null;
    if (r) { r.onend = null; try { r.stop(); } catch { /* noop */ } }
    setListening(false);
  }, []);

  // Voice is active for the whole open session; paused only while APEXA is speaking.
  useEffect(() => {
    const want = open && micEnabled && !speaking;
    shouldListenRef.current = want;
    if (want) startListening();
    else stopListening();
  }, [open, micEnabled, speaking, startListening, stopListening]);

  // ── auto-scroll chat ────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  // ── open / close ────────────────────────────────────────────────────────────
  const toggleOpen = useCallback(() => {
    setOpen(prev => {
      const next = !prev;
      if (next && messages.length === 0) {
        setMessages([{ role: 'bot', text: GREETING }]);
        setTimeout(() => speak(GREETING), 250);
      }
      if (!next) { stopSpeaking(); stopListening(); }   // close ends the voice session
      return next;
    });
  }, [messages.length, speak, stopSpeaking, stopListening]);

  // ── cleanup on unmount ──────────────────────────────────────────────────────────
  useEffect(() => () => { window.speechSynthesis?.cancel(); recogRef.current?.abort?.(); }, []);

  return (
    <>
      <style>{`
        @keyframes apexa-rise  { from { opacity:0; transform: translateY(16px) scale(.97);} to{opacity:1; transform:none;} }
        @keyframes apexa-dot   { 0%,80%,100%{ transform: scale(.5); opacity:.4;} 40%{ transform: scale(1); opacity:1;} }
        @keyframes apexa-bars  { 0%,100%{ height:5px;} 50%{ height:15px;} }
        .apexa-scroll::-webkit-scrollbar{ width:5px; }
        .apexa-scroll::-webkit-scrollbar-thumb{ background:rgba(90,169,255,.3); border-radius:3px; }
      `}</style>

      {/* ── NAV CARD (thin, wide, blue-glass, no inner borders) ───── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            [sideKey]: '24px',
            width: 'min(520px, calc(100vw - 24px))',
            height: 'min(320px, calc(100vh - 150px))',
            zIndex: 100000,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '22px',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, rgba(40,80,150,0.16), rgba(10,24,55,0.12))',
            backdropFilter: 'blur(30px) saturate(160%)',
            WebkitBackdropFilter: 'blur(30px) saturate(160%)',
            border: '1px solid rgba(150,200,255,0.18)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
            animation: 'apexa-rise .28s ease-out',
            fontFamily: 'system-ui, sans-serif',
            textShadow: '0 0 10px rgba(150,200,255,0.55)',
          }}
        >
          {/* header — no divider border */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px' }}>
            <Avatar resting={false} size={34} />
            <div style={{ flex: 1, lineHeight: 1.15 }}>
              <div style={{ color: '#eaf3ff', fontWeight: 600, fontSize: '15px', letterSpacing: '.5px' }}>{BOT_NAME}</div>
              <div style={{ color: ACCENT, fontSize: '11px', opacity: 0.9 }}>
                {speaking ? 'Speaking…' : listening ? 'Listening…' : thinking ? 'Thinking…' : 'Voice active'}
              </div>
            </div>
            <IconBtn title={micEnabled ? 'Turn mic off' : 'Turn mic on'} onClick={() => setMicEnabled(m => !m)}>
              {micEnabled ? '🎙️' : '🚫'}
            </IconBtn>
            <IconBtn title={muted ? 'Unmute voice' : 'Mute voice'} onClick={() => { setMuted(m => !m); stopSpeaking(); }}>
              {muted ? '🔇' : '🔊'}
            </IconBtn>
            <IconBtn title="Close" onClick={toggleOpen}>✕</IconBtn>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="apexa-scroll" style={{
            flex: 1, overflowY: 'auto', padding: '6px 14px 12px',
            display: 'flex', flexDirection: 'column', gap: '9px',
          }}>
            {messages.map((m, i) => <Bubble key={i} role={m.role} text={m.text} />)}
            {thinking && (
              <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', alignSelf: 'flex-start' }}>
                {[0, 1, 2].map(d => (
                  <span key={d} style={{
                    width: '7px', height: '7px', borderRadius: '50%', background: ACCENT,
                    animation: `apexa-dot 1.2s ${d * 0.18}s infinite ease-in-out`,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* composer — no divider border */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px 12px' }}>
            <span title={listening ? 'Listening' : micEnabled ? 'Mic ready' : 'Mic off'} style={{
              width: '38px', height: '38px', flexShrink: 0, borderRadius: '50%',
              background: listening ? ACCENT : 'rgba(90,169,255,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {listening
                ? <span style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '15px' }}>
                    {[0, 1, 2].map(b => (
                      <span key={b} style={{ width: '3px', background: '#06223e', borderRadius: '2px',
                        animation: `apexa-bars .8s ${b * 0.15}s infinite ease-in-out` }} />
                    ))}
                  </span>
                : <MicIcon dim={!micEnabled} />}
            </span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(); }}
              placeholder={`Message ${BOT_NAME}…`}
              style={{
                flex: 1, height: '38px', padding: '0 14px', borderRadius: '19px',
                border: 'none', outline: 'none',
                background: 'rgba(255,255,255,0.08)', color: '#eaf3ff', fontSize: '14px',
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              title="Send"
              style={{
                width: '38px', height: '38px', flexShrink: 0, borderRadius: '50%',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                background: input.trim() ? ACCENT : 'rgba(90,169,255,0.16)',
                color: '#06223e', fontSize: '17px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >➤</button>
          </div>
        </div>
      )}

      {/* ── FLOATING BOT ICON ─────────────────────────────────────── */}
      <button
        onClick={toggleOpen}
        title={`Talk to ${BOT_NAME}`}
        style={{
          position: 'fixed',
          bottom: '24px',
          [sideKey]: '24px',
          width: '150px', height: '150px', borderRadius: '50%',
          border: 'none', cursor: 'pointer', padding: 0,
          background: 'transparent',
          zIndex: 100000,
        }}
      >
        <Avatar resting={!open} size={150} />
      </button>
    </>
  );
}

// ─── AVATAR ─────────────────────────────────────────────────────────────────────
// resting → APEXA.mp4 with black background removed (mix-blend screen)
// selected → APEXX.jpg still image, same size
function Avatar({ resting, size }) {
  if (resting) {
    return (
      <video
        src="/APEXA.mp4"
        autoPlay muted loop playsInline
        style={{
          display: 'block', width: size, height: size, objectFit: 'contain',
          background: 'transparent',
          mixBlendMode: 'screen',          // black → transparent
          filter: 'contrast(1.15) brightness(1.05)',
        }}
      />
    );
  }
  return (
    <img
      src="/APEXX.jpg" alt={BOT_NAME}
      style={{
        display: 'block', width: size, height: size, borderRadius: '50%', objectFit: 'cover',
        border: 'none', boxShadow: 'none',
      }}
    />
  );
}

function Bubble({ role, text }) {
  const isUser = role === 'user';
  return (
    <div style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      maxWidth: '84%',
      padding: '9px 13px', borderRadius: '14px', fontSize: '14px', lineHeight: 1.45,
      color: isUser ? '#06223e' : '#ffffff',
      fontWeight: isUser ? 600 : 500,
      textShadow: isUser ? 'none' : '0 0 10px rgba(150,200,255,0.6)',
      background: isUser ? ACCENT : 'rgba(255,255,255,0.08)',
      border: 'none',
      borderBottomRightRadius: isUser ? '4px' : '14px',
      borderBottomLeftRadius:  isUser ? '14px' : '4px',
      whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    }}>
      {text}
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: '28px', height: '28px', borderRadius: '8px', border: 'none', cursor: 'pointer',
      background: 'rgba(255,255,255,0.08)', color: '#d6e8ff', fontSize: '13px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}

function MicIcon({ dim }) {
  const c = dim ? '#7790ad' : ACCENT;
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}
