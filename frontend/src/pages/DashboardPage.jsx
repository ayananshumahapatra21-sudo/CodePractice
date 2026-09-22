import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Flame, Zap, CheckCircle2, Clock, BarChart3, ArrowRight, Sparkles, Target, Compass } from 'lucide-react';
import StatCard from '../components/StatCard';
import GamificationWidget from '../components/GamificationWidget';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [gamificationProfile, setGamificationProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, recRes, gamRes] = await Promise.all([
          userService.getDashboard(),
          userService.getRecommendations().catch(() => []),
          userService.getGamification().catch(() => null)
        ]);
        setDashboardData(dashRes);
        setRecommendations(recRes);
        setGamificationProfile(gamRes);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-sm font-semibold">Loading Developer Dashboard...</span>
        </div>
      </div>
    );
  }

  const {
    username, solved_total, total_problems,
    easy_solved, easy_total, medium_solved, medium_total,
    hard_solved, hard_total, total_submissions, success_rate,
    streak, xp, level, recent_submissions
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
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8 bg-slate-950 min-h-screen text-slate-100">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 uppercase">
            {username?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <span>{username}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                Level {level || 1} Coder
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">AI-assisted learning dashboard & progress analytics.</p>
          </div>
        </div>

        {/* Practice Streak & Stats Badge */}
        <div className="flex items-center gap-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/15 text-amber-400 rounded-xl">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Streak</span>
              <span className="text-xl font-extrabold text-white">{streak} Days</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-slate-800" />

          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Accuracy</span>
            <span className="text-xl font-extrabold text-emerald-400">{success_rate}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Gamification & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Gamification Status */}
        <div className="lg:col-span-4">
          <GamificationWidget profile={gamificationProfile || { xp, level, streak }} solvedCount={solved_total} />
        </div>

        {/* Right AI Recommendations */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Personalized AI Recommendations</span>
            </h2>
            <span className="text-xs text-slate-400">Targeted practice based on your history</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div key={rec.problem_id} className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
                        {rec.category}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        rec.difficulty === 'Easy' ? 'text-emerald-400' : rec.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {rec.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{rec.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{rec.reason}</p>
                  </div>

                  <Link
                    to={`/problems/${rec.problem_id}`}
                    className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Solve Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-slate-500 text-xs">
                Solve a few coding problems to unlock personalized AI practice recommendations!
              </div>
            )}
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Recent Submissions</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">Total Submissions: {total_submissions}</span>
        </div>

        {recent_submissions && recent_submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-xs uppercase font-extrabold tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Runtime</th>
                  <th className="py-3 px-4 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {recent_submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      <Link to={`/problems/${sub.problem}`} className="hover:text-indigo-400 transition-colors">
                        #{sub.problem_number || sub.problem}. {sub.problem_title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs uppercase text-slate-400">
                      {sub.language}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border inline-block ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                      {sub.execution_time} ms
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-slate-400">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 space-y-3">
            <BarChart3 className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm">No submission history yet.</p>
            <Link to="/problems" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline">
              <span>Start solving problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
