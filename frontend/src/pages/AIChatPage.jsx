import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';

const QUICK_PROMPTS = [
  'How should I study for a data structures exam?',
  'Give me tips for staying focused during long study sessions',
  'Explain the Pomodoro technique',
  'How do I memorize complex algorithms?',
];

export default function AIChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', text: msg, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const res = await api.post('/ai/chat', { message: msg, history });

      const botMsg = { role: 'model', text: res.data.reply, id: Date.now() + 1 };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I had trouble responding. Please try again.', id: Date.now() + 1, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-up">
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-3">
          <MessageSquare className="text-sage" size={30} /> AI Study Assistant
        </h1>
        <p className="text-slate font-body mt-1">Ask anything about studying, concepts, or exam prep.</p>
      </div>

      <div className="card flex-1 flex flex-col overflow-hidden p-0">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-16 h-16 bg-sage/10 rounded-2xl flex items-center justify-center mb-4">
                <Bot size={32} className="text-sage" />
              </div>
              <p className="font-display font-semibold text-ink mb-1">Hey {user?.name?.split(' ')[0]}! I'm your study assistant.</p>
              <p className="text-slate text-sm font-body mb-6">Ask me anything about studying or your subjects.</p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                {QUICK_PROMPTS.map(prompt => (
                  <button key={prompt} onClick={() => sendMessage(prompt)}
                    className="text-left p-3 rounded-xl bg-black/3 hover:bg-sage/10 text-sm text-slate hover:text-ink transition-all font-body border border-transparent hover:border-sage/20">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-body leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-ink text-paper rounded-tr-sm'
                  : msg.error
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-white text-ink border border-black/5 rounded-tl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center shrink-0 mt-1">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border border-black/5 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="loading-dots flex gap-1">
                  <span className="w-2 h-2 bg-sage rounded-full inline-block" />
                  <span className="w-2 h-2 bg-sage rounded-full inline-block" />
                  <span className="w-2 h-2 bg-sage rounded-full inline-block" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-black/5 p-4">
          <div className="flex gap-3">
            <input
              className="input flex-1"
              placeholder="Ask your study assistant..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="btn-primary px-4 py-3"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="text-xs text-slate/50 font-mono mt-2 text-center">Press Enter to send</p>
        </div>
      </div>
    </div>
  );
}
