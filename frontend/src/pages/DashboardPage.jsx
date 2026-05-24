import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CheckCircle2, Clock, BookOpen, Sparkles, TrendingUp, Circle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes, plansRes] = await Promise.all([
          api.get('/tasks/stats'),
          api.get('/tasks?completed=false'),
          api.get('/plans')
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.slice(0, 5));
        setPlans(plansRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = stats ? [
    { label: 'Total Tasks', value: stats.total, icon: BookOpen, color: 'bg-sage/10 text-sage' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
    { label: 'Due Today', value: stats.dueToday, icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: 'Hours Logged', value: stats.totalHours, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
  ] : [];

  const completionRate = stats?.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const chartData = [
    { day: 'Mon', tasks: 3 }, { day: 'Tue', tasks: 5 }, { day: 'Wed', tasks: 2 },
    { day: 'Thu', tasks: 7 }, { day: 'Fri', tasks: 4 }, { day: 'Sat', tasks: 1 }, { day: 'Sun', tasks: 6 },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate font-body mt-1">Here's your study overview for today.</p>
        </div>
        <Link to="/generate" className="btn-primary flex items-center gap-2">
          <Sparkles size={18} />
          Generate Plan
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-3xl font-display font-bold text-ink">{value}</p>
            <p className="text-slate text-sm font-body mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Completion ring + chart */}
        <div className="card">
          <h2 className="section-title mb-6">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={28}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A5568', fontFamily: 'DM Sans' }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0D0D0D', border: 'none', borderRadius: '10px', color: '#F5F0E8', fontFamily: 'DM Sans' }}
                cursor={{ fill: '#4A7C5910' }}
              />
              <Bar dataKey="tasks" fill="#4A7C59" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center gap-3 p-3 bg-sage/5 rounded-xl">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#4A7C5920" strokeWidth="4" />
                <circle cx="20" cy="20" r="16" fill="none" stroke="#4A7C59" strokeWidth="4"
                  strokeDasharray={`${completionRate} 100`} strokeLinecap="round" pathLength="100" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-sage">{completionRate}%</span>
            </div>
            <div>
              <p className="font-display font-semibold text-ink text-sm">Completion Rate</p>
              <p className="text-slate text-xs font-body">{stats?.completed} of {stats?.total} tasks done</p>
            </div>
          </div>
        </div>

        {/* Pending tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Pending Tasks</h2>
            <Link to="/tasks" className="text-sage text-sm font-display font-semibold hover:text-sage-dark transition-colors">
              View all →
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 size={40} className="text-sage mx-auto mb-3 opacity-40" />
              <p className="text-slate font-body text-sm">All caught up! No pending tasks.</p>
              <Link to="/tasks" className="text-sage text-sm font-semibold mt-2 inline-block">Add a task →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map(task => (
                <div key={task._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/3 transition-colors">
                  <Circle size={18} className="text-black/20 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-ink text-sm truncate">{task.title}</p>
                    <p className="text-slate text-xs font-body">{task.subject}</p>
                  </div>
                  <span className={`badge-${task.priority} shrink-0`}>{task.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active plans */}
      {plans.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Active Study Plans</h2>
            <Link to="/plans" className="text-sage text-sm font-display font-semibold hover:text-sage-dark transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan._id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} className="text-sage" />
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${plan.status === 'active' ? 'bg-sage/10 text-sage' : 'bg-slate/10 text-slate'}`}>
                    {plan.status}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-ink">{plan.title}</h3>
                <p className="text-slate text-xs font-body mt-1">
                  {plan.subjects?.length || 0} subject{plan.subjects?.length !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
