import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Terminal, User, LogOut, LayoutDashboard, ListFilter, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#0f131d] border-b border-[#1e2433] sticky top-0 z-50 px-4 lg:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
            Code<span className="text-blue-500">Practice</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#151926] p-1 rounded-xl border border-[#22293a]">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isActive('/') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-[#1e2436]'
            }`}
          >
            Home
          </Link>

          <Link
            to="/problems"
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
              isActive('/problems') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-[#1e2436]'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            Problems
          </Link>

          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
              isActive('/dashboard') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-[#1e2436]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* User Auth Profile */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-[#171c2b] border border-[#252d42] hover:border-blue-500/50 px-3.5 py-1.5 rounded-xl transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                  {user?.username?.[0] || 'U'}
                </div>
                <span className="text-sm font-semibold text-gray-200">{user?.username}</span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-[#1b202e] rounded-xl transition-all"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
