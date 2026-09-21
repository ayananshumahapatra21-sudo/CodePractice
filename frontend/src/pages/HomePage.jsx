import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight, CheckCircle2, Zap, Trophy, ShieldCheck, Cpu, Terminal, Flame } from 'lucide-react';
import StatCard from '../components/StatCard';
import { problemService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_questions: 20,
    easy_questions: 15,
    medium_questions: 4,
    hard_questions: 1,
    solved_questions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await problemService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 lg:px-8 border-b border-[#1b202e]">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Algorithmic Practice Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Level Up Your Code Skills with <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">CodePractice</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed font-normal">
            Solve 20+ curated data structure and algorithm challenges in Python, JavaScript, Java, and C++. Test your code against sample test cases, submit for evaluation, and track your practice streak.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/problems"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/25 hover:scale-105 transition-all flex items-center gap-3"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl bg-[#171c2b] hover:bg-[#1f263b] border border-[#273147] text-gray-200 font-semibold text-base transition-all flex items-center gap-2.5"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Counter Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 -mt-10 relative z-20 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Questions"
            value={stats.total_questions}
            icon={Code2}
            color="text-blue-400"
            bg="bg-blue-500/10"
          />
          <StatCard
            title="Easy Questions"
            value={stats.easy_questions}
            total={stats.total_questions}
            icon={CheckCircle2}
            color="text-emerald-400"
            bg="bg-emerald-500/10"
          />
          <StatCard
            title="Medium Questions"
            value={stats.medium_questions}
            total={stats.total_questions}
            icon={Zap}
            color="text-amber-400"
            bg="bg-amber-500/10"
          />
          <StatCard
            title="Hard Questions"
            value={stats.hard_questions}
            total={stats.total_questions}
            icon={Flame}
            color="text-rose-400"
            bg="bg-rose-500/10"
          />
          <StatCard
            title="Questions Solved"
            value={stats.solved_questions}
            total={stats.total_questions}
            icon={Trophy}
            color="text-purple-400"
            bg="bg-purple-500/10"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20 w-full">
        <div className="text-center mb-14 space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Built for Competitive Coders</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">Everything you need to practice algorithms and ace technical coding interviews.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#12151e] border border-[#1e2433] p-8 rounded-2xl space-y-4 hover:border-blue-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Monaco Code Editor</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Integrated VS Code-like browser editor with syntax highlighting, auto-indentation, line numbers, and dark/light themes.
            </p>
          </div>

          <div className="bg-[#12151e] border border-[#1e2433] p-8 rounded-2xl space-y-4 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Isolated Code Runner</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Instant execution sandbox running your code against test cases with execution time metrics and detailed diffs.
            </p>
          </div>

          <div className="bg-[#12151e] border border-[#1e2433] p-8 rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Progress Analytics</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Track solved problems by difficulty, monitor your streak, review past submission history, and measure accuracy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Sparkles({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
