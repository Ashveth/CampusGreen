
import React, { useState } from 'react';
import { Challenge } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ChallengesProps {
  challenges: Challenge[];
  completedIds: string[];
  onComplete: (challenge: Challenge) => void;
}

const Challenges: React.FC<ChallengesProps> = ({ challenges, completedIds, onComplete }) => {
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const categories = ['Waste', 'Energy', 'Transport', 'Food'];
  
  const getCatStyles = (cat: string) => {
    switch(cat) {
      case 'Waste': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Energy': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Transport': return 'bg-primary/10 text-primary border-primary/20';
      case 'Food': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    
    setIsSubmitting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `A student suggested a new sustainability challenge for their campus app: "${suggestion}". 
        Give them a very short (1 sentence), enthusiastic, and encouraging response validating their idea. 
        Start with something like "Wow!" or "Great thinking!".`,
      });
      setAiFeedback(response.text || "That's a fantastic idea! We'll add it to the roadmap.");
    } catch (err) {
      setAiFeedback("Great thinking! Our team will review this quest soon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuggestModal = () => {
    setIsSuggestModalOpen(false);
    setSuggestion('');
    setAiFeedback(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-primary/10 pb-6">
        <div>
          <h2 className="text-3xl font-black text-customNeutral dark:text-slate-100 tracking-tight">Sustainability Quests</h2>
          <p className="text-customNeutral/60 dark:text-slate-400 font-medium mt-1">Earn eco-points and unlock campus badges.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} className="px-5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-customNeutral/60 dark:text-slate-300 text-xs font-bold uppercase tracking-widest hover:border-primary transition-all">
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map(challenge => {
          const isCompleted = completedIds.includes(challenge.id);
          return (
            <div 
              key={challenge.id} 
              className={`p-8 rounded-[2rem] border-2 transition-all relative overflow-hidden group ${
                isCompleted 
                  ? 'bg-primary/5 dark:bg-primary/10 border-primary/30 opacity-75' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1'
              }`}
            >
              <div className="absolute -bottom-8 -right-8 text-primary/5 text-9xl pointer-events-none group-hover:scale-110 transition-transform">🌿</div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`text-4xl w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner ${isCompleted ? 'bg-primary/10' : 'bg-secondary dark:bg-slate-800'}`}>
                    {challenge.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-primary">{challenge.points}</span>
                    <span className="text-[10px] font-black text-customNeutral/30 uppercase tracking-tighter">Points</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCatStyles(challenge.category)}`}>
                      {challenge.category}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-1 rounded-full">✓ Complete</span>
                    )}
                  </div>
                  <h4 className={`text-xl font-black mb-2 ${isCompleted ? 'text-primary' : 'text-customNeutral dark:text-slate-100'}`}>
                    {challenge.title}
                  </h4>
                  <p className="text-customNeutral/60 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">{challenge.description}</p>
                </div>

                <button
                  disabled={isCompleted}
                  onClick={() => onComplete(challenge)}
                  className={`w-full py-4 rounded-2xl font-black transition-all text-sm uppercase tracking-widest ${
                    isCompleted 
                      ? 'bg-primary/20 text-primary cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-[#1b5e20] shadow-lg shadow-primary/20'
                  }`}
                >
                  {isCompleted ? 'Claimed' : 'I did this!'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-[#37474F] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl mt-12 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h3 className="text-4xl font-black mb-4 tracking-tight">Have a green idea?</h3>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">Submit your own challenges and inspire the entire campus community to adopt better habits.</p>
          </div>
          <button 
            onClick={() => setIsSuggestModalOpen(true)}
            className="bg-accent hover:bg-[#f9a825] text-customNeutral px-10 py-5 rounded-[2rem] font-black transition-all shadow-xl hover:scale-105 active:scale-95 text-lg"
          >
            Suggest a Quest
          </button>
        </div>
      </div>

      {/* Suggestion Modal */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-customNeutral/80 backdrop-blur-md animate-fade-in" onClick={closeSuggestModal}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border-8 border-white dark:border-slate-800">
            <div className="p-8 bg-primary text-white flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-tighter uppercase">Quest Creator</h3>
              <button onClick={closeSuggestModal} className="text-2xl opacity-50 hover:opacity-100">✕</button>
            </div>
            
            <div className="p-10">
              {aiFeedback ? (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="text-6xl mb-4">🌟</div>
                  <p className="text-xl font-bold text-customNeutral dark:text-white leading-relaxed">
                    {aiFeedback}
                  </p>
                  <div className="pt-4">
                    <button 
                      onClick={closeSuggestModal}
                      className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform"
                    >
                      Got it!
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSuggest} className="space-y-6">
                  <p className="text-customNeutral/60 dark:text-slate-400 font-medium">What's a new sustainable habit students should try?</p>
                  <textarea 
                    autoFocus
                    required
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="e.g. Host a dorm room clothing swap..."
                    className="w-full bg-secondary dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 min-h-[120px] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-bold"
                  />
                  <button 
                    disabled={isSubmitting || !suggestion.trim()}
                    className="w-full bg-primary hover:bg-[#1b5e20] text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <><span>🚀</span> Send Suggestion</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;
