import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Coffee, Brain } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'text-sage', bg: 'bg-sage' },
  short: { label: 'Short Break', duration: 5 * 60, color: 'text-amber-600', bg: 'bg-amber' },
  long: { label: 'Long Break', duration: 15 * 60, color: 'text-blue-500', bg: 'bg-blue-500' },
};

export default function TimerPage() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [subject, setSubject] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(MODES[mode].duration);
    setRunning(false);
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') setSessions(s => s + 1);
            // Browser notification
            if (Notification.permission === 'granted') {
              new Notification(`${MODES[mode].label} complete!`, { body: mode === 'focus' ? 'Time for a break!' : 'Back to studying!' });
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const reset = () => { setRunning(false); setTimeLeft(MODES[mode].duration); };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const progress = 1 - timeLeft / MODES[mode].duration;
  const circumference = 2 * Math.PI * 120;

  const requestNotif = () => {
    if (Notification.permission === 'default') Notification.requestPermission();
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-lg mx-auto">
      <div className="text-center">
        <h1 className="page-title flex items-center justify-center gap-3">
          <Timer className="text-sage" size={30} /> Study Timer
        </h1>
        <p className="text-slate font-body mt-1">Pomodoro technique — 25 min focus, then break.</p>
      </div>

      {/* Mode switcher */}
      <div className="flex gap-2 justify-center">
        {Object.entries(MODES).map(([key, val]) => (
          <button key={key} onClick={() => setMode(key)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all ${
              mode === key ? `${val.bg} text-white shadow-md` : 'bg-white text-slate hover:text-ink'
            }`}>
            {val.label}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="card flex flex-col items-center py-10">
        <div className="relative w-64 h-64">
          <svg className="w-64 h-64 -rotate-90" viewBox="0 0 264 264">
            <circle cx="132" cy="132" r="120" fill="none" stroke="#0D0D0D08" strokeWidth="8" />
            <circle cx="132" cy="132" r="120" fill="none"
              stroke={mode === 'focus' ? '#4A7C59' : mode === 'short' ? '#E8A838' : '#3B82F6'}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-6xl font-bold text-ink tracking-tight">{mins}:{secs}</span>
            <span className={`font-display font-semibold text-sm mt-1 ${MODES[mode].color}`}>{MODES[mode].label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button onClick={reset} className="w-12 h-12 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all">
            <RotateCcw size={20} className="text-slate" />
          </button>
          <button onClick={() => { setRunning(!running); requestNotif(); }}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 ${MODES[mode].bg} text-white`}>
            {running ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
          </button>
          <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
            <span className="font-mono font-bold text-sage text-sm">{sessions}</span>
          </div>
        </div>
        <p className="text-slate/50 text-xs font-body mt-3">{sessions} session{sessions !== 1 ? 's' : ''} completed today</p>
      </div>

      {/* Subject input */}
      <div className="card">
        <label className="label flex items-center gap-2"><Brain size={16} /> What are you studying?</label>
        <input className="input" placeholder="e.g. Operating Systems — Process Management"
          value={subject} onChange={e => setSubject(e.target.value)} />
      </div>

      {/* Tips */}
      <div className="card bg-sage/5 border border-sage/10">
        <div className="flex items-start gap-3">
          <Coffee size={20} className="text-sage shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-semibold text-ink text-sm">Pomodoro Tips</p>
            <ul className="text-slate text-xs font-body mt-2 space-y-1 list-disc ml-4">
              <li>Work for exactly 25 minutes with zero distractions</li>
              <li>After 4 sessions, take a 15-minute long break</li>
              <li>Use breaks to stretch, drink water, or walk</li>
              <li>Track which subject you studied each session</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
