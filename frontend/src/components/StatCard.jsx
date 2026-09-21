import React from 'react';

export default function StatCard({ title, value, total, icon: Icon, color, bg }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-[#12151e] border border-[#1e2433] rounded-2xl p-5 shadow-xl hover:border-[#2b354d] transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-2xl font-extrabold text-white">{value}</span>
        {total !== undefined && (
          <span className="text-xs font-semibold text-gray-400">/ {total}</span>
        )}
      </div>

      {total !== undefined && (
        <div className="w-full bg-[#1b202e] h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              color.includes('green') ? 'bg-[#00b8a3]' :
              color.includes('amber') || color.includes('yellow') ? 'bg-[#ffc01e]' :
              color.includes('red') || color.includes('rose') ? 'bg-[#ff375f]' :
              'bg-blue-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
