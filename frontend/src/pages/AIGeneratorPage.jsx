import { useState } from 'react';
import api from '../services/api';
import { Sparkles, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const emptySubject = () => ({ name: '', examDate: '', priority: 'medium', hoursPerWeek: 5 });

export default function AIGeneratorPage() {
  const [subjects, setSubjects] = useState([emptySubject()]);
  const [config, setConfig] = useState({ startDate: '', endDate: '', hoursPerDay: 4, studyStyle: 'balanced', planTitle: '' });
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const addSubject = () => setSubjects([...subjects, emptySubject()]);
  const removeSubject = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const updateSubject = (i, field, val) => {
    const updated = [...subjects];
    updated[i] = { ...updated[i], [field]: val };
    setSubjects(updated);
  };

  const generate = async () => {
    if (!subjects[0].name) { toast.error('Add at least one subject.'); return; }
    if (!config.startDate || !config.endDate) { toast.error('Set a study period.'); return; }
    setLoading(true);
    setGeneratedPlan('');
    try {
      const res = await api.post('/ai/generate-plan', { subjects, ...config });
      setGeneratedPlan(res.data.plan);
      toast.success('Study plan generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!generatedPlan) return;
    setSaving(true);
    try {
      await api.post('/plans', {
        title: config.planTitle || `Study Plan — ${new Date().toLocaleDateString()}`,
        subjects,
        startDate: config.startDate,
        endDate: config.endDate,
        aiGeneratedPlan: generatedPlan
      });
      toast.success('Plan saved to your plans!');
    } catch { toast.error('Failed to save plan.'); }
    finally { setSaving(false); }
  };

  // Convert markdown-like text to structured display
  const formatPlan = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-display font-bold text-ink mt-6 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-display font-bold text-sage mt-4 mb-3">{line.slice(2)}</h1>;
      if (line.startsWith('### ')) return <h3 key={i} className="font-display font-semibold text-ink mt-4 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-ink mt-2">{line.slice(2, -2)}</p>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 text-slate font-body text-sm list-disc">{line.slice(2)}</li>;
      if (line.match(/^\d+\./)) return <li key={i} className="ml-4 text-slate font-body text-sm list-decimal">{line.replace(/^\d+\./, '').trim()}</li>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-slate font-body text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Sparkles className="text-sage" size={32} /> AI Study Planner
        </h1>
        <p className="text-slate font-body mt-1">Tell the AI about your subjects and exams — it'll build you a personalised plan.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-4">
          {/* Plan title */}
          <div className="card">
            <label className="label">Plan name (optional)</label>
            <input className="input" placeholder="e.g. Semester 5 Finals Prep"
              value={config.planTitle} onChange={e => setConfig({ ...config, planTitle: e.target.value })} />
          </div>

          {/* Subjects */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Subjects & Exams</h2>
              <button onClick={addSubject} className="btn-ghost flex items-center gap-1 text-sage text-sm">
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-4">
              {subjects.map((sub, i) => (
                <div key={i} className="p-4 bg-black/3 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <input className="input flex-1" placeholder="Subject name (e.g. Data Structures)"
                      value={sub.name} onChange={e => updateSubject(i, 'name', e.target.value)} />
                    {subjects.length > 1 && (
                      <button onClick={() => removeSubject(i)} className="text-black/20 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="label text-xs">Exam date</label>
                      <input type="date" className="input text-sm py-2"
                        value={sub.examDate} onChange={e => updateSubject(i, 'examDate', e.target.value)} />
                    </div>
                    <div>
                      <label className="label text-xs">Priority</label>
                      <select className="input text-sm py-2" value={sub.priority} onChange={e => updateSubject(i, 'priority', e.target.value)}>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="label text-xs">Hrs/week</label>
                      <input type="number" className="input text-sm py-2" min="1" max="40"
                        value={sub.hoursPerWeek} onChange={e => updateSubject(i, 'hoursPerWeek', Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study config */}
          <div className="card space-y-4">
            <h2 className="section-title">Study Configuration</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Start date</label>
                <input type="date" className="input" value={config.startDate} onChange={e => setConfig({ ...config, startDate: e.target.value })} />
              </div>
              <div>
                <label className="label">End date</label>
                <input type="date" className="input" value={config.endDate} onChange={e => setConfig({ ...config, endDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Hours per day</label>
                <input type="number" className="input" min="1" max="16" value={config.hoursPerDay}
                  onChange={e => setConfig({ ...config, hoursPerDay: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label">Study style</label>
                <select className="input" value={config.studyStyle} onChange={e => setConfig({ ...config, studyStyle: e.target.value })}>
                  <option value="balanced">Balanced</option>
                  <option value="intensive">Intensive</option>
                  <option value="spaced-repetition">Spaced Repetition</option>
                  <option value="exam-focused">Exam Focused</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={generate} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
            {loading ? <><Loader2 size={20} className="animate-spin" /> Generating your plan...</> : <><Sparkles size={20} /> Generate Study Plan</>}
          </button>
        </div>

        {/* Output panel */}
        <div className="card min-h-96">
          {!generatedPlan && !loading && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-16 h-16 bg-sage/10 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles size={32} className="text-sage opacity-50" />
              </div>
              <p className="font-display font-semibold text-slate">Your plan will appear here</p>
              <p className="text-slate/60 text-sm font-body mt-1">Fill in the form and click Generate</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <Loader2 size={40} className="text-sage animate-spin mb-4" />
              <p className="font-display font-semibold text-slate">AI is building your plan...</p>
              <p className="text-slate/60 text-sm font-body mt-1">This usually takes 10–20 seconds</p>
            </div>
          )}

          {generatedPlan && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title text-sage">Your Study Plan</h2>
                <button onClick={savePlan} disabled={saving} className="btn-primary flex items-center gap-2 py-2 text-sm">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
              <div className="prose max-w-none overflow-y-auto max-h-[600px] pr-2">
                {formatPlan(generatedPlan)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
