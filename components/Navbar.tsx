
import React, { useState } from 'react';
import { View, User } from '../types';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  user: User;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, user, isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'challenges', label: 'Quests', icon: '🎯' },
    { id: 'feed', label: 'Feed', icon: '📱' },
    { id: 'market', label: 'Market', icon: '♻️' },
    { id: 'scanner', label: 'Scan', icon: '📸' },
    { id: 'map', label: 'Map', icon: '📍' },
    { id: 'ai', label: 'AI', icon: '✨' },
  ];

  const userAvatar = user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  return (
    <nav className="bg-primary dark:bg-slate-900 text-white shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setCurrentView('dashboard')}
          >
            <div className="bg-white p-1.5 rounded-lg">
              <span className="text-xl">🌿</span>
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline">CampusGreen</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
                  currentView === item.id ? 'bg-[#1b5e20] dark:bg-slate-800 text-white shadow-inner' : 'text-emerald-50 hover:bg-[#388e3c] dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-bold text-[10px] uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
            
            <div className="h-6 w-px bg-white/20 mx-2"></div>

            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-[#388e3c] dark:hover:bg-slate-800 transition-colors mr-2"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>

            <button 
              onClick={() => setCurrentView('profile')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all border border-white/20 ${currentView === 'profile' ? 'bg-[#1b5e20]' : 'bg-[#1b5e20]/50'}`}
            >
              <img src={userAvatar} className="w-8 h-8 rounded-full border border-white/40" alt="Avatar" />
              <span className="font-bold hidden lg:inline text-accent">{user.points} pts</span>
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center space-x-3">
             <button 
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full bg-[#1b5e20] dark:bg-slate-800"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1b5e20] dark:bg-slate-900 border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-4 rounded-xl text-base font-bold ${
                  currentView === item.id ? 'bg-[#003300] text-white' : 'text-emerald-50 hover:bg-[#388e3c]'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button
                onClick={() => {
                  setCurrentView('profile');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-4 rounded-xl text-base font-bold text-accent"
              >
                <span className="mr-3">👤</span> Profile ({user.points} pts)
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
