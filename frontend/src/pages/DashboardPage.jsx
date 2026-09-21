import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Flame, Zap, CheckCircle2, Clock, BarChart3, AlertCircle, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await userService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-sm font-semibold">Loading Dashboard Stats...</span>
        </div>
      </div>
    );
  }

  const {
    username, solved_total, total_problems,
    easy_solved, easy_total, medium_solved, medium_total,
    hard_solved, hard_total, total_submissions, success_rate,
    streak, recent_submissions
  } = dashboardData || {};

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Wrong Answer':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Time Limit Exceeded':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-[#12151e] border border-[#1e2433] p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 uppercase">
            {username?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <span>{username}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                Coder
              </span>
            </h1>
            <p className="text-gray-400 text-xs mt-1">Keep practicing algorithms to build your streak!</p>
          </div>
        </div>

        {/* Practice Streak Badge */}
        <div className="flex items-center gap-6 bg-[#171c2b] p-4 rounded-xl border border-[#232c42]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/15 text-amber-400 rounded-xl">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Practice Streak</span>
              <span className="text-xl font-extrabold text-white">{streak} Days</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-[#2a344d]" />

          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Success Rate</span>
            <span className="text-xl font-extrabold text-emerald-400">{success_rate}%</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Solved"
          value={solved_total}
          total={total_problems}
          icon={Trophy}
          color="text-purple-400"
          bg="bg-purple-500/10"
        />
        <StatCard
          title="Easy Solved"
          value={easy_solved}
          total={easy_total}
          icon={CheckCircle2}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <StatCard
          title="Medium Solved"
          value={medium_solved}
          total={medium_total}
          icon={Zap}
          color="text-amber-400"
          bg="bg-amber-500/10"
        />
        <StatCard
          title="Hard Solved"
          value={hard_solved}
          total={hard_total}
          icon={Flame}
          color="text-rose-400"
          bg="bg-rose-500/10"
        />
      </div>

      {/* Recent Submissions Log */}
      <div className="bg-[#12151e] border border-[#1e2433] rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>Recent Submissions</span>
          </h2>
          <span className="text-xs font-semibold text-gray-400">Total Submissions: {total_submissions}</span>
        </div>

        {recent_submissions && recent_submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#161a26] text-gray-400 text-xs uppercase font-extrabold tracking-wider border-b border-[#1f2638]">
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Runtime</th>
                  <th className="py-3 px-4 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a202e] text-sm">
                {recent_submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#181d2a] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-200">
                      <Link to={`/problems/${sub.problem}`} className="hover:text-blue-400 transition-colors">
                        #{sub.problem_number}. {sub.problem_title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs uppercase text-gray-400">
                      {sub.language}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border inline-block ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-400">
                      {sub.execution_time} ms
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-gray-400">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 space-y-3">
            <BarChart3 className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-sm">No submission history yet.</p>
            <Link to="/problems" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline">
              <span>Start solving problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
