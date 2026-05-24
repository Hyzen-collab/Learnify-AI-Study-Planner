import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-ink flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage rounded-xl flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl">Learnify</span>
        </div>
        <div>
          <p className="text-5xl font-display font-bold text-white leading-tight mb-4">
            Study smarter,<br />
            <span className="text-sage-light">not harder.</span>
          </p>
          <p className="text-white/50 font-body text-lg">
            AI-powered study plans tailored to your schedule, subjects, and exam dates.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['AI Study Plans', 'Generated in seconds'], ['Smart Tasks', 'Auto-organized'], ['Progress Tracking', 'Visual analytics'], ['Study Timer', 'Stay focused']].map(([title, sub]) => (
            <div key={title} className="bg-white/5 rounded-xl p-4">
              <p className="text-white font-display font-semibold text-sm">{title}</p>
              <p className="text-white/40 text-xs font-body mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <GraduationCap size={24} className="text-sage" />
            <span className="font-display font-bold text-xl">StudyAI</span>
          </div>

          <h1 className="page-title mb-2">Welcome back</h1>
          <p className="text-slate font-body mb-8">Log in to continue your study journey.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@university.ac.lk"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate hover:text-ink transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="text-center text-slate font-body mt-6 text-sm">
            No account?{' '}
            <Link to="/register" className="text-sage font-semibold hover:text-sage-dark transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
