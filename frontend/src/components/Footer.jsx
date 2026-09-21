import React from 'react';
import { Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b0e17] border-t border-[#1a202c] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
          <Terminal className="w-4 h-4 text-blue-500" />
          <span>CodePractice &copy; {new Date().getFullYear()} — Master Competitive Programming</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
          <a href="#privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          <a href="#problems" className="hover:text-gray-300 transition-colors">Problem Set</a>
        </div>
      </div>
    </footer>
  );
}
