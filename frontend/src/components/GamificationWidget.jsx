import React from 'react';
import { Flame, Trophy, Zap, Award, Sparkles, CheckCircle2 } from 'lucide-react';

const GamificationWidget = ({ profile, solvedCount }) => {
  if (!profile) return null;

  const { xp = 0, level = 1, streak = 0, unlocked_badges = [] } = profile;
  // Progress towards next level
  const currentLevelXpFloor = Math.pow(level - 1, 2) * 50;
  const nextLevelXpFloor = Math.pow(level, 2) * 50;
  const xpInCurrentLevel = xp - currentLevelXpFloor;
  const xpNeededForNextLevel = Math.max(nextLevelXpFloor - currentLevelXpFloor, 50);
  const progressPercent = Math.min(Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100), 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header Level & Streak */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/20">
            {level}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Current Rank</div>
            <div className="text-lg font-bold text-white flex items-center gap-1.5">
              Level {level} Coder
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
          <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400">Streak</div>
            <div className="text-sm font-black text-amber-300">{streak} Days</div>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-medium mb-1.5 text-slate-400">
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-400" /> {xp} XP</span>
          <span>{progressPercent}% to Lvl {level + 1}</span>
        </div>
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Badges Carousel / Grid */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-amber-400" /> Achievements ({unlocked_badges.length})</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {unlocked_badges.length > 0 ? (
            unlocked_badges.map((b) => (
              <div key={b.id || b.code} className="flex items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Award className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-200 truncate">{b.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{b.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-center text-xs text-slate-500">
              Solve problems to unlock your first achievement badge!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationWidget;
