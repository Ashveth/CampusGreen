
import React, { useState } from 'react';
import { MOCK_RESOURCES } from '../constants';
import { CampusResource } from '../types';

const CampusMap: React.FC = () => {
  const [selected, setSelected] = useState<CampusResource | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const filteredResources = filter === 'All' 
    ? MOCK_RESOURCES 
    : MOCK_RESOURCES.filter(r => r.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Water': return '🚰';
      case 'Bike': return '🚲';
      case 'Recycle': return '♻️';
      default: return '📍';
    }
  };

  const getMarkerStyle = (type: string) => {
    switch (type) {
      case 'Water': return 'bg-blue-500 shadow-blue-500/30';
      case 'Bike': return 'bg-primary shadow-primary/30';
      case 'Recycle': return 'bg-amber-500 shadow-amber-500/30';
      default: return 'bg-customNeutral shadow-customNeutral/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap gap-1">
          {['All', 'Water', 'Bike', 'Recycle'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                filter === f ? 'bg-primary text-white shadow-lg' : 'bg-transparent text-customNeutral/50 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Stylized Campus Illustration Map */}
        <div className="bg-[#e9e9d6] dark:bg-slate-800 rounded-[2.5rem] aspect-square md:aspect-video relative overflow-hidden border-[12px] border-white dark:border-slate-900 shadow-2xl transition-colors">
          {/* Decorative Campus Grid/Paths */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#2E7D32_2px,_transparent_2px)] bg-[length:40px_40px]"></div>
          <div className="absolute top-1/2 left-0 w-full h-8 bg-white/20 -translate-y-1/2 -rotate-12 border-y border-white/30"></div>
          <div className="absolute top-0 left-1/3 w-8 h-full bg-white/20 border-x border-white/30"></div>
          
          {/* Stylized Buildings */}
          <div className="absolute top-12 left-20 w-32 h-24 bg-white/60 dark:bg-slate-700/50 rounded-xl flex items-center justify-center font-bold text-primary/30 rotate-2 border border-white/50 backdrop-blur-sm">Library</div>
          <div className="absolute bottom-16 right-32 w-40 h-28 bg-white/60 dark:bg-slate-700/50 rounded-xl flex items-center justify-center font-bold text-primary/30 -rotate-3 border border-white/50 backdrop-blur-sm shadow-xl">Auditorium</div>
          <div className="absolute top-1/4 right-20 w-24 h-24 bg-white/60 dark:bg-slate-700/50 rounded-3xl flex items-center justify-center font-bold text-primary/30 rotate-12 border border-white/50 backdrop-blur-sm">Lab</div>

          {/* Interactive Markers */}
          {filteredResources.map((resource, i) => {
            // Pseudo-consistent positioning based on ID
            const hash = resource.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const left = 15 + (hash % 70);
            const top = 15 + ((hash * 7) % 70);
            const isSelected = selected?.id === resource.id;

            return (
              <button
                key={resource.id}
                onClick={() => setSelected(resource)}
                className={`absolute transition-all duration-500 z-10 flex flex-col items-center ${isSelected ? 'scale-150 z-20' : 'hover:scale-110'}`}
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white border-4 border-white dark:border-slate-800 shadow-xl ${getMarkerStyle(resource.type)}`}>
                  <span className="text-xl">{getIcon(resource.type)}</span>
                </div>
                {isSelected && (
                  <div className="mt-2 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded shadow-lg text-primary border border-primary/20">
                    {resource.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-customNeutral dark:text-slate-100 tracking-tight">Resource Explorer</h3>
        {selected ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border-4 border-primary/5 dark:border-slate-800 animate-slide-up">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 text-4xl shadow-lg border-4 border-white dark:border-slate-800 ${getMarkerStyle(selected.type)}`}>
              <span className="text-white">{getIcon(selected.type)}</span>
            </div>
            <h4 className="text-2xl font-black text-customNeutral dark:text-slate-100 leading-none mb-1">{selected.name}</h4>
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-4">{selected.type} Location</p>
            <p className="text-customNeutral/60 dark:text-slate-400 leading-relaxed font-medium text-sm mb-8">{selected.description}</p>
            <div className="space-y-3">
              <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-[#1b5e20] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 group">
                <span className="group-hover:translate-x-1 transition-transform">🛰️</span> Start Navigation
              </button>
              <button className="w-full bg-secondary dark:bg-slate-800 text-customNeutral/60 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-colors text-xs uppercase tracking-widest">
                Update Status
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/50 dark:bg-slate-900/40 border-4 border-dashed border-primary/10 rounded-[2rem] h-64 flex flex-col items-center justify-center p-8 text-center transition-all">
             <div className="text-6xl mb-6 opacity-20 grayscale">📍</div>
             <p className="text-customNeutral/40 dark:text-slate-500 font-bold text-sm uppercase tracking-widest leading-relaxed">Select a map marker to view facilities</p>
          </div>
        )}

        <div className="bg-primary/5 dark:bg-slate-800/50 p-6 rounded-2xl border border-primary/10">
          <h4 className="font-black text-primary/50 mb-4 text-[10px] uppercase tracking-[0.2em]">Live Activity</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <p className="text-xs font-bold text-customNeutral/70">3 users currently at <span className="text-primary">Union Refill</span></p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <p className="text-xs font-bold text-customNeutral/70">Bike Rack at <span className="text-primary">Library</span> is 80% full</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
