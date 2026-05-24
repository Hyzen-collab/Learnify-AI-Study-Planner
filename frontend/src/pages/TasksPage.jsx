import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, CheckCircle2, Circle, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const PRIORITIES = ['high', 'medium', 'low'];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [form, setForm] = useState({ title: '', subject: '', description: '', dueDate: '', estimatedMinutes: 60, priority: 'medium' });

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch { toast.error('Failed to load tasks.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', form);
      setTasks([res.data, ...tasks]);
      setForm({ title: '', subject: '', description: '', dueDate: '', estimatedMinutes: 60, priority: 'medium' });
      setShowForm(false);
      toast.success('Task added!');
    } catch { toast.error('Failed to create task.'); }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
      toast.success(res.data.completed ? 'Task completed! 🎉' : 'Task reopened.');
    } catch { toast.error('Failed to update task.'); }
  };

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="text-slate font-body mt-1">{tasks.filter(t => !t.completed).length} tasks pending</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'pending', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-semibold capitalize transition-all ${filter === f ? 'bg-sage text-white' : 'bg-white text-slate hover:text-ink'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Add task form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">New Task</h2>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-2"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Task title *</label>
                <input className="input" placeholder="Read Chapter 5 - Algorithms" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Subject</label>
                  <input className="input" placeholder="Data Structures" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Due date</label>
                  <input type="date" className="input" value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
                <div>
                  <label className="label">Est. minutes</label>
                  <input type="number" className="input" min="5" value={form.estimatedMinutes}
                    onChange={e => setForm({ ...form, estimatedMinutes: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea className="input resize-none" rows={2} placeholder="Optional notes..."
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle2 size={48} className="text-sage mx-auto mb-4 opacity-30" />
          <p className="text-slate font-display font-semibold">No tasks here</p>
          <p className="text-slate/60 text-sm font-body mt-1">
            {filter === 'completed' ? "You haven't completed any tasks yet." : "Click 'Add Task' to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => (
            <div key={task._id}
              className={`card flex items-center gap-4 p-4 transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}>
              <button onClick={() => toggleComplete(task)} className="shrink-0 transition-transform hover:scale-110">
                {task.completed
                  ? <CheckCircle2 size={22} className="text-sage" />
                  : <Circle size={22} className="text-black/20 hover:text-sage transition-colors" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-body font-medium text-ink ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {task.subject && <span className="text-slate text-xs font-body">{task.subject}</span>}
                  {task.dueDate && (
                    <span className="text-xs font-mono text-slate/70">
                      Due {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  {task.estimatedMinutes && (
                    <span className="text-xs font-mono text-slate/70">~{task.estimatedMinutes}min</span>
                  )}
                </div>
              </div>
              <span className={`badge-${task.priority} shrink-0`}>{task.priority}</span>
              <button onClick={() => deleteTask(task._id)} className="shrink-0 text-black/20 hover:text-red-500 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
