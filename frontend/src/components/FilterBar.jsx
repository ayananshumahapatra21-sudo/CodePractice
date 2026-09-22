import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCategory,
  setSelectedCategory
}) {
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const categories = [
    'All', 'Arrays', 'Strings', 'Hash Maps', 'Linked Lists', 'Stacks',
    'Queues', 'Trees', 'Graphs', 'Recursion', 'Sorting',
    'Searching', 'Dynamic Programming', 'Greedy Algorithms'
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedDifficulty !== 'All' || selectedCategory !== 'All';

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by title, number, or keyword..."
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          {difficulties.map((diff) => {
            const active = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? diff === 'Easy' ? 'bg-emerald-500 text-black font-bold shadow'
                      : diff === 'Medium' ? 'bg-amber-400 text-black font-bold shadow'
                      : diff === 'Hard' ? 'bg-rose-600 text-white font-bold shadow'
                      : 'bg-indigo-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-indigo-400" />
          Topics:
        </span>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                active
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/50'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-xs font-semibold text-rose-400 hover:underline flex items-center gap-1"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
