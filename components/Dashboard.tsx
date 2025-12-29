
import React, { useState, useEffect } from 'react';
import { User, View } from '../types';
import { getDailyEcoTip } from '../services/geminiService';

interface DashboardProps {
  user: User;
  onSwitchView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSwitchView }) => {
  const [dailyTip, setDailyTip] = useState<string>("Ditch the disposables and bring a reusable bottle or mug to class—it’s the easiest way to save money and cut down on campus plastic waste!");
  const [isLoadingTip, setIsLoadingTip] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await getDailyEcoTip(user.completedChallenges);
      if (tip) setDailyTip(tip);
      setIsLoadingTip(false);
    };
    fetchTip();
  }, [user.completedChallenges]);

  const ecoScore = Math.min(Math.round((user.points / 1000) * 100), 100);
  const userAvatar = user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  // Circular progress math
  const radius = 85;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (ecoScore / 100) * circumference;

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div 
            className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border-4 border-white dark:border-slate-700 overflow-hidden cursor-pointer hover:rotate-3 transition-transform"
            onClick={() => onSwitchView('profile')}
          >
            <img src={userAvatar} className="w-full h-full object-cover" alt="Profile" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-customNeutral dark:text-slate-100 tracking-tight flex items-center gap-2">
              Hello, {user.name.split(' ')[0]}! <span className="text-primary opacity-60">🌿</span>
            </h1>
            <p className="text-customNeutral/40 dark:text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Your green journey is making a real difference.</p>
          </div>
        </div>
        <button 
          onClick={() => onSwitchView('challenges')}
          className="bg-[#2E7D32]/20 hover:bg-[#2E7D32]/30 text-primary px-8 py-3.5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 border-2 border-primary/10"
        >
          <span>🎯</span> New Challenges
        </button>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Global Impact Score Card - Refined Proper Circle */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border-[3px] border-[#99b6ff] shadow-[0_20px_50px_rgba(153,182,255,0.2)] dark:shadow-[0_20px_50px_rgba(153,182,255,0.05)] flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[420px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 pointer-events-none"></div>
          
          <h3 className="text-[10px] font-black text-customNeutral/30 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">Global Impact Score</h3>
          
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Proper SVG Progress Circle */}
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90 drop-shadow-sm"
            >
              {/* Background Path */}
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset: 0 }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="text-slate-100 dark:text-slate-800"
              />
              {/* Progress Path */}
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-black text-customNeutral dark:text-slate-100 leading-none tracking-tighter">
                {ecoScore}
              </span>
              <span className="text-[12px] font-black text-customNeutral/30 uppercase tracking-[0.2em] mt-1">Growth</span>
            </div>
          </div>
          
          <p className="mt-8 text-sm font-black text-primary/60 italic uppercase tracking-widest text-[10px]">
            "Sprouting Seed" Status
          </p>
        </div>

        {/* Daily Green Insight Card */}
        <div className="lg:col-span-2 bg-[#f4f7ed] dark:bg-slate-900/50 p-12 rounded-[2.5rem] border border-primary/5 relative overflow-hidden flex flex-col justify-between group shadow-sm">
          <div className="absolute top-10 right-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <div className="w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-12 h-12 bg-accent/20 text-accent-700 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-accent/20">✨</div>
              <h4 className="font-black text-primary dark:text-primary uppercase tracking-[0.2em] text-[10px]">Daily Green Insight</h4>
            </div>
            
            <p className={`text-3xl md:text-4xl font-black text-customNeutral/80 dark:text-slate-100 leading-[1.15] tracking-tight ${isLoadingTip ? 'animate-pulse' : ''}`}>
              "{dailyTip}"
            </p>
          </div>
          
          <div className="mt-12 flex items-center justify-between">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="avatar" className="w-11 h-11 rounded-full border-4 border-[#f4f7ed] dark:border-slate-800 shadow-md" />
              ))}
              <div className="w-11 h-11 rounded-full bg-accent dark:bg-accent/80 border-4 border-[#f4f7ed] dark:border-slate-800 flex items-center justify-center text-[10px] font-black text-customNeutral shadow-md">+24</div>
            </div>
            <span className="text-[10px] font-black text-customNeutral/30 dark:text-slate-500 uppercase tracking-widest">Trending on Campus</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Active Mission Card */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group">
           <h3 className="text-xs font-black text-customNeutral/30 dark:text-slate-500 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
             <span className="bg-primary/10 p-2.5 rounded-xl group-hover:rotate-12 transition-transform">🚀</span> Active Mission
           </h3>
           <div className="bg-secondary dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700 relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <p className="font-black text-customNeutral dark:text-slate-100 text-xl tracking-tight">Bike to Campus 3 Days</p>
                 <p className="text-[10px] font-bold text-customNeutral/40 uppercase tracking-widest mt-1">Weekly Transport Goal</p>
               </div>
               <div className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg shadow-primary/20">+50</div>
             </div>
             <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
               <div className="bg-primary h-full w-[33%] rounded-full shadow-lg shadow-primary/20 transition-all duration-1000"></div>
             </div>
             <p className="mt-4 text-right text-[10px] font-black text-primary uppercase tracking-widest">1 of 3 days logged</p>
           </div>
        </div>

        {/* Campus Pulse Card */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group">
           <h3 className="text-xs font-black text-customNeutral/30 dark:text-slate-500 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
             <span className="bg-accent/10 p-2.5 rounded-xl text-accent-700 group-hover:scale-110 transition-transform">📊</span> Campus Pulse
           </h3>
           <div className="space-y-8">
             <div>
               <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                 <span className="text-customNeutral/40 dark:text-slate-400">Waste Recycled</span>
                 <span className="text-customNeutral dark:text-slate-200">1,240 kg</span>
               </div>
               <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full">
                 <div className="bg-primary h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(46,125,50,0.3)]"></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                 <span className="text-customNeutral/40 dark:text-slate-400">Water Refills</span>
                 <span className="text-customNeutral dark:text-slate-200">8,920 liters</span>
               </div>
               <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full">
                 <div className="bg-blue-500 h-full w-[82%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
