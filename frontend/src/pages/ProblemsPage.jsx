import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight, Code2 } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import { problemService } from '../services/api';

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const data = await problemService.getProblems({
          search: searchQuery,
          difficulty: selectedDifficulty,
          category: selectedCategory
        });
        setProblems(data);
      } catch (err) {
        console.error('Failed to fetch problems:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProblems, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Page Title Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Code2 className="w-8 h-8 text-blue-500" />
            <span>Problem Set</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Browse and solve coding challenges by difficulty or category.</p>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Problems List Table */}
      <div className="bg-[#12151e] border border-[#1e2433] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Loading problems dataset...</span>
          </div>
        ) : problems.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <Code2 className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-base font-bold text-gray-300">No problems found matching filters.</p>
            <p className="text-xs text-gray-500">Try adjusting your search query, difficulty, or category filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#161a26] text-gray-400 text-xs uppercase font-extrabold tracking-wider border-b border-[#1f2638]">
                  <th className="py-4 px-6 w-16 text-center">Status</th>
                  <th className="py-4 px-6 w-20">#</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 w-32">Difficulty</th>
                  <th className="py-4 px-6 w-28 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a202e] text-sm">
                {problems.map((prob) => {
                  const isSolved = prob.solved_status === 'Solved';
                  const isAttempted = prob.solved_status === 'Attempted';
                  return (
                    <tr
                      key={prob.id}
                      className="hover:bg-[#181d2a] transition-colors group"
                    >
                      {/* Solved Status */}
                      <td className="py-4 px-6 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 inline-block" title="Solved" />
                        ) : isAttempted ? (
                          <Circle className="w-5 h-5 text-amber-400 inline-block fill-amber-400/20" title="Attempted" />
                        ) : (
                          <span className="text-gray-600 font-bold">-</span>
                        )}
                      </td>

                      {/* Number */}
                      <td className="py-4 px-6 font-mono font-bold text-gray-400">
                        {prob.problem_number}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-6">
                        <Link
                          to={`/problems/${prob.id}`}
                          className="font-bold text-gray-100 hover:text-blue-400 transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-200"
                        >
                          <span>{prob.title}</span>
                        </Link>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1a2133] text-blue-300 border border-[#27324c]">
                          {prob.category}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border inline-block ${getDifficultyBadge(prob.difficulty)}`}>
                          {prob.difficulty}
                        </span>
                      </td>

                      {/* Solve Action */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/problems/${prob.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-600/15 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <span>Solve</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
