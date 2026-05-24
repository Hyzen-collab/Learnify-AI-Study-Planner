import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/plans').then(res => setPlans(res.data)).catch(() => toast.error('Failed to load plans.')).finally(() => setLoading(false));
  }, []);

  const deletePlan = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await api.delete(`/plans/${id}`);
      setPlans(plans.filter(p => p._id !== id));
      toast.success('Plan deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Study Plans</h1>
          <p className="text-slate font-body mt-1">{plans.length} saved plan{plans.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/generate" className="btn-primary flex items-center gap-2">
          <Sparkles size={18} /> Generate New
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="card text-center py-20">
          <BookOpen size={48} className="text-sage mx-auto mb-4 opacity-30" />
          <p className="font-display font-semibold text-slate text-lg">No plans yet</p>
          <p className="text-slate/60 text-sm font-body mt-1 mb-6">Use AI to generate your first personalised study plan.</p>
          <Link to="/generate" className="btn-primary inline-flex items-center gap-2">
            <Sparkles size={18} /> Generate a Plan
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => (
            <div key={plan._id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen size={20} className="text-sage" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-semibold text-ink">{plan.title}</h2>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${plan.status === 'active' ? 'bg-sage/10 text-sage' : 'bg-slate/10 text-slate'}`}>
                      {plan.status}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-1 flex-wrap">
                    <span className="text-slate text-xs font-body">{plan.subjects?.length || 0} subjects</span>
                    {plan.startDate && (
                      <span className="text-slate/60 text-xs font-mono">
                        {new Date(plan.startDate).toLocaleDateString()} → {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'ongoing'}
                      </span>
                    )}
                  </div>
                  {plan.subjects?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {plan.subjects.map((s, i) => (
                        <span key={i} className={`badge-${s.priority}`}>{s.name}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {plan.aiGeneratedPlan && (
                    <button onClick={() => setExpanded(expanded === plan._id ? null : plan._id)}
                      className="btn-ghost flex items-center gap-1 text-sm text-sage">
                      {expanded === plan._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {expanded === plan._id ? 'Collapse' : 'View Plan'}
                    </button>
                  )}
                  <button onClick={() => deletePlan(plan._id)} className="p-2 text-black/20 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {expanded === plan._id && plan.aiGeneratedPlan && (
                <div className="mt-4 pt-4 border-t border-black/5">
                  <div className="bg-black/3 rounded-xl p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-slate font-body whitespace-pre-wrap leading-relaxed">
                      {plan.aiGeneratedPlan}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
