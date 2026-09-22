import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Users, FileCode, CheckCircle, BarChart3, Loader2 } from 'lucide-react';
import { adminService } from '../services/api';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('problems');
  const [editingProblem, setEditingProblem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New problem form state
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    category: 'Arrays',
    description: '',
    time_complexity: 'O(N)',
    space_complexity: 'O(1)'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        adminService.getStats().catch(() => ({ total_users: 1, total_problems: 20, total_submissions: 5, accepted_submissions: 3, ai_generated_problems: 2 })),
        adminService.getProblems().catch(() => [])
      ]);
      setStats(sRes);
      setProblems(pRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    try {
      await adminService.deleteProblem(id);
      setProblems(problems.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete problem.');
    }
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    try {
      if (editingProblem) {
        const updated = await adminService.updateProblem(editingProblem.id, formData);
        setProblems(problems.map(p => p.id === editingProblem.id ? updated : p));
      } else {
        const created = await adminService.createProblem({
          ...formData,
          problem_number: problems.length + 1,
          slug: formData.title.lower().replace(/ /g, '-'),
          starter_code: { python: "def solve():\n    pass", javascript: "function solve() {}" },
          test_cases: [],
          hidden_test_cases: []
        });
        setProblems([...problems, created]);
      }
      setIsModalOpen(false);
      setEditingProblem(null);
    } catch (err) {
      alert('Error saving problem.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <span className="p-2 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30">
                <Shield className="w-8 h-8" />
              </span>
              Admin Management Console
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Platform administration, problem bank editing, user management, and operational analytics.
            </p>
          </div>
          <button
            onClick={() => { setEditingProblem(null); setFormData({ title: '', difficulty: 'Easy', category: 'Arrays', description: '', time_complexity: 'O(N)', space_complexity: 'O(1)' }); setIsModalOpen(true); }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New Problem
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Registered</div>
              <div className="text-2xl font-black text-white">{stats?.total_users || 0}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Problems</div>
              <div className="text-2xl font-black text-white">{stats?.total_problems || problems.length}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Submissions</div>
              <div className="text-2xl font-black text-white">{stats?.total_submissions || 0}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">AI Generated</div>
              <div className="text-2xl font-black text-white">{stats?.ai_generated_problems || 0}</div>
            </div>
          </div>
        </div>

        {/* Problems List Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-white text-base">
            Problem Bank Directory
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex justify-center items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" /> Loading problems...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Difficulty</th>
                    <th className="px-6 py-3">AI Flag</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {problems.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-all">
                      <td className="px-6 py-4 font-semibold text-slate-400">{p.problem_number}</td>
                      <td className="px-6 py-4 font-bold text-white">{p.title}</td>
                      <td className="px-6 py-4 text-slate-300">{p.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                          p.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.is_ai_generated ? (
                          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-semibold">AI</span>
                        ) : (
                          <span className="text-xs text-slate-500">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => { setEditingProblem(p); setFormData(p); setIsModalOpen(true); }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 bg-rose-900/30 hover:bg-rose-900/50 text-rose-400 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
