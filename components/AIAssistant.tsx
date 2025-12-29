
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getSustainabilityAdvice } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm your CampusGreen Assistant. Ask me anything about sustainability on campus!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const advice = await getSustainabilityAdvice(userMessage);
    
    setMessages(prev => [...prev, { role: 'assistant', content: advice }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[75vh] flex flex-col bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white dark:border-slate-800 transition-all animate-fade-in">
      <div className="p-8 bg-primary dark:bg-slate-800 text-white flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner">
            ✨
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Eco Advisor</h2>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <p className="text-emerald-50/60 text-[10px] font-black uppercase tracking-widest">Powered by Gemini Pro</p>
            </div>
          </div>
        </div>
        <div className="hidden md:block px-6 py-2 bg-white/10 rounded-2xl border border-white/20 text-xs font-bold uppercase tracking-widest">
          Context: On Campus
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-10 space-y-8 bg-[#fdfdfb] dark:bg-slate-950/40">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[2rem] px-8 py-5 shadow-sm font-medium leading-relaxed text-sm ${
              m.role === 'user' 
                ? 'bg-primary text-white rounded-br-none shadow-primary/20' 
                : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-customNeutral dark:text-slate-100 rounded-bl-none shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] rounded-bl-none px-8 py-5 shadow-sm flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about dorm energy saving..."
            className="flex-grow bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-customNeutral dark:text-slate-100 rounded-[1.5rem] px-8 py-5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white dark:focus:bg-slate-700 transition-all font-bold text-base placeholder:text-customNeutral/30"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-[#1b5e20] text-white w-16 h-16 rounded-[1.5rem] font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 flex items-center justify-center active:scale-95 group"
          >
            <svg className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <div className="mt-6 flex flex-wrap gap-3">
           {["Carbon footprint tips", "Recycling guide", "Sustainable eating"].map(q => (
             <button
              key={q}
              onClick={() => setInput(q)}
              className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/5 px-6 py-2.5 rounded-xl hover:bg-primary/10 transition-colors border border-primary/10"
             >
               {q}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
