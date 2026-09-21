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
    'All', 'Array', 'String', 'Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 'Dynamic Programming'
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedDifficulty !== 'All' || selectedCategory !== 'All';

  return (
    <div className="bg-[#12151e] border border-[#1e2433] p-5 rounded-2xl shadow-xl flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by title, number, or keyword..."
            className="w-full bg-[#171b28] border border-[#252d42] text-gray-200 text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center bg-[#171b28] p-1 rounded-xl border border-[#252d42]">
          {difficulties.map((diff) => {
            const active = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? diff === 'Easy' ? 'bg-[#00b8a3] text-black shadow'
                      : diff === 'Medium' ? 'bg-[#ffc01e] text-black shadow'
                      : diff === 'Hard' ? 'bg-[#ff375f] text-white shadow'
                      : 'bg-blue-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1a202c]">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-blue-400" />
          Categories:
        </span>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                active
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                  : 'bg-[#171b28] text-gray-400 hover:text-gray-200 border border-[#232a3d]'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-xs font-semibold text-red-400 hover:underline flex items-center gap-1"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
