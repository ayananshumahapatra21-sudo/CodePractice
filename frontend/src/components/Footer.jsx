import React from 'react';
import { Terminal, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 mt-auto text-slate-400">
      <div className="max-w-7xl mx-auto px-4 text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Terminal className="w-4 h-4 text-indigo-500" />
          <span>CodePractice &copy; {new Date().getFullYear()} — Built with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> by <strong className="text-white">Ayananshu Mahapatra</strong></span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
          <a href="/problems" className="hover:text-slate-300 transition-colors">Problem Set</a>
          <a href="/ai-generator" className="hover:text-slate-300 transition-colors">AI Generator</a>
          <a href="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</a>
        </div>
      </div>
    </footer>
  );
}
