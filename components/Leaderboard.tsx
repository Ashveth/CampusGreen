
import React from 'react';
import { LEADERBOARD_DATA } from '../constants';

const Leaderboard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in">
      <div className="p-10 bg-primary dark:bg-slate-800 text-white relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <h2 className="text-3xl font-black tracking-tight">Campus Eco-Legends</h2>
        <p className="text-emerald-50/60 text-sm font-medium mt-1">Celebrating the students who lead our green revolution.</p>
      </div>
      
      <div className="p-10">
        {/* Cinematic Podium */}
        <div className="flex justify-between items-end mb-16 gap-4 px-2 max-w-2xl mx-auto">
          {/* 2nd place */}
          <div className="flex flex-col items-center flex-1 order-1">
             <div className="relative mb-4 group">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${LEADERBOARD_DATA[1].name}`} className="w-20 h-20 rounded-3xl border-4 border-slate-200 dark:border-slate-700 shadow-xl group-hover:-translate-y-1 transition-transform" alt="2nd" />
                <div className="absolute -bottom-3 -right-3 bg-slate-400 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black border-4 border-white dark:border-slate-900 shadow-lg">2</div>
             </div>
             <span className="font-black text-customNeutral dark:text-slate-300 text-xs text-center line-clamp-1 uppercase tracking-tighter mb-1">{LEADERBOARD_DATA[1].name}</span>
             <div className="w-full bg-slate-100 dark:bg-slate-800 h-24 rounded-t-3xl mt-2 flex flex-col items-center justify-center">
                <span className="text-primary font-black text-sm">{LEADERBOARD_DATA[1].points}</span>
                <span className="text-[8px] font-bold text-customNeutral/40 uppercase">Pts</span>
             </div>
          </div>
          
          {/* 1st place - Soft Yellow Accent */}
          <div className="flex flex-col items-center flex-1 order-2">
             <div className="relative mb-6 group">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-accent text-5xl animate-bounce">👑</div>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${LEADERBOARD_DATA[0].name}`} className="w-24 h-24 rounded-[2rem] border-8 border-accent shadow-2xl group-hover:-translate-y-2 transition-transform" alt="1st" />
                <div className="absolute -bottom-4 -right-4 bg-accent text-customNeutral w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black border-4 border-white dark:border-slate-900 shadow-xl">1</div>
             </div>
             <span className="font-black text-customNeutral dark:text-slate-100 text-sm text-center line-clamp-1 uppercase tracking-widest mb-1">{LEADERBOARD_DATA[0].name}</span>
             <div className="w-full bg-primary/10 dark:bg-primary/20 h-32 rounded-t-3xl mt-2 border-x-4 border-t-4 border-primary/10 flex flex-col items-center justify-center">
                <span className="text-primary font-black text-lg">{LEADERBOARD_DATA[0].points}</span>
                <span className="text-[10px] font-bold text-primary uppercase">Pts</span>
             </div>
          </div>
          
          {/* 3rd place */}
          <div className="flex flex-col items-center flex-1 order-3">
             <div className="relative mb-4 group">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${LEADERBOARD_DATA[2].name}`} className="w-20 h-20 rounded-3xl border-4 border-amber-200 shadow-xl group-hover:-translate-y-1 transition-transform" alt="3rd" />
                <div className="absolute -bottom-3 -right-3 bg-amber-600/80 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black border-4 border-white dark:border-slate-900 shadow-lg">3</div>
             </div>
             <span className="font-black text-customNeutral dark:text-slate-300 text-xs text-center line-clamp-1 uppercase tracking-tighter mb-1">{LEADERBOARD_DATA[2].name}</span>
             <div className="w-full bg-slate-50 dark:bg-slate-800 h-20 rounded-t-3xl mt-2 flex flex-col items-center justify-center">
                <span className="text-primary font-black text-sm">{LEADERBOARD_DATA[2].points}</span>
                <span className="text-[8px] font-bold text-customNeutral/40 uppercase">Pts</span>
             </div>
          </div>
        </div>

        {/* Improved List View */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {LEADERBOARD_DATA.slice(3).map((user, idx) => (
            <div key={user.name} className="flex items-center justify-between p-5 bg-secondary dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg rounded-2xl transition-all group border border-transparent hover:border-slate-100">
              <div className="flex items-center space-x-6">
                <span className="text-customNeutral/30 dark:text-slate-600 font-black text-sm w-4">{idx + 4}</span>
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 p-1 border border-slate-200 group-hover:rotate-6 transition-transform">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="user" className="w-full h-full" />
                </div>
                <div>
                  <span className="font-black text-customNeutral dark:text-slate-200 block">{user.name}</span>
                  <span className="text-[10px] font-bold text-primary uppercase">Elite Contributor</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-primary text-lg">{user.points}</span>
                <span className="text-[10px] font-black text-customNeutral/30 uppercase ml-1">Pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
