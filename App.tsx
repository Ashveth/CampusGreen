
import React, { useState, useEffect } from 'react';
import { User, View, Challenge } from './types';
import { MOCK_CHALLENGES } from './constants';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Challenges from './components/Challenges';
import Leaderboard from './components/Leaderboard';
import CampusMap from './components/CampusMap';
import AIAssistant from './components/AIAssistant';
import Profile from './components/Profile';
import Login from './components/Login';
import EcoFeed from './components/EcoFeed';
import WasteScanner from './components/WasteScanner';
import GreenMarketplace from './components/GreenMarketplace';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('campusgreen-auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('campusgreen-user');
    if (savedUser) return JSON.parse(savedUser);
    return {
      id: 'user-1',
      name: 'Alex Student',
      username: 'alex_green',
      email: 'alex@campus.edu',
      points: 450,
      completedChallenges: [],
      badges: ['b1'],
    };
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('campusgreen-dark-mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('campusgreen-user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('campusgreen-auth', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('campusgreen-dark-mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (name: string, username: string, email: string) => {
    setCurrentUser(prev => ({ ...prev, name, username, email }));
    setIsLoggedIn(true);
  };

  const completeChallenge = (challenge: Challenge) => {
    if (!currentUser.completedChallenges.includes(challenge.id)) {
      setCurrentUser(prev => ({
        ...prev,
        points: prev.points + challenge.points,
        completedChallenges: [...prev.completedChallenges, challenge.id]
      }));
    }
  };

  const updateProfile = (name: string, username: string, avatarUrl: string) => {
    setCurrentUser(prev => ({ ...prev, name, username, avatarUrl }));
    setCurrentView('dashboard');
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={currentUser}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10 max-w-5xl">
        {currentView === 'dashboard' && (
          <Dashboard 
            user={currentUser} 
            onSwitchView={setCurrentView} 
          />
        )}
        {currentView === 'challenges' && (
          <Challenges 
            challenges={MOCK_CHALLENGES} 
            completedIds={currentUser.completedChallenges}
            onComplete={completeChallenge}
          />
        )}
        {currentView === 'leaderboard' && <Leaderboard />}
        {currentView === 'map' && <CampusMap />}
        {currentView === 'ai' && <AIAssistant />}
        {currentView === 'feed' && <EcoFeed user={currentUser} />}
        {currentView === 'market' && <GreenMarketplace user={currentUser} />}
        {currentView === 'scanner' && <WasteScanner onComplete={() => setCurrentView('dashboard')} />}
        {currentView === 'profile' && (
          <Profile user={currentUser} onUpdate={updateProfile} />
        )}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-customNeutral dark:text-slate-400 text-sm">
        <p>© 2024 CampusGreen - Building a sustainable future, one student at a time.</p>
      </footer>
    </div>
  );
};

export default App;
