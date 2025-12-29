
import React, { useState, useRef } from 'react';
import { User, EcoPost } from '../types';
import { GoogleGenAI } from "@google/genai";

interface EcoFeedProps {
  user: User;
}

const EcoFeed: React.FC<EcoFeedProps> = ({ user }) => {
  const [posts, setPosts] = useState<EcoPost[]>([
    { id: '1', userId: 'u1', username: 'green_bean', content: 'Just used the library refill station 3 times today! Saved 3 plastic bottles. 🚰', timestamp: new Date(), likes: 12, hasLiked: false },
    { id: '2', userId: 'u2', username: 'eco_emma', content: 'Found a great plant-based burger at the dining hall. Highly recommend! 🥗', timestamp: new Date(Date.now() - 3600000), likes: 8, hasLiked: false },
  ]);
  const [newPost, setNewPost] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const polishCaption = async () => {
    if (!newPost.trim()) return;
    setIsAILoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a social media expert for a college sustainability app called CampusGreen. 
        Rewrite this student's eco-win post to be extremely catchy, inspiring, and authentic for a university community. 
        Use 1-2 relevant emojis and maintain a friendly, encouraging tone. 
        Keep it concise (under 30 words).
        
        Original text: "${newPost}"`,
      });
      setNewPost(response.text?.trim() || newPost);
    } catch (err) {
      console.error("AI Polishing Error:", err);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!newPost.trim() && !selectedImage) return;
    const post: EcoPost = {
      id: Math.random().toString(),
      userId: user.id,
      username: user.username,
      content: newPost,
      image: selectedImage || undefined,
      timestamp: new Date(),
      likes: 0,
      hasLiked: false
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedImage(null);
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Collective Impact Banner */}
      <div className="bg-primary dark:bg-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black">Campus Impact</h2>
            <p className="text-emerald-50/60 text-xs font-bold uppercase tracking-widest mt-1">Collective achievements this semester</p>
          </div>
          <div className="flex gap-4">
             <div className="text-center">
               <div className="text-2xl font-black text-accent">12.4k</div>
               <div className="text-[10px] font-black uppercase opacity-50">Bottles</div>
             </div>
             <div className="w-px h-8 bg-white/20"></div>
             <div className="text-center">
               <div className="text-2xl font-black text-accent">840</div>
               <div className="text-[10px] font-black uppercase opacity-50">Bikes</div>
             </div>
             <div className="w-px h-8 bg-white/20"></div>
             <div className="text-center">
               <div className="text-2xl font-black text-accent">2k</div>
               <div className="text-[10px] font-black uppercase opacity-50">Kg Waste</div>
             </div>
          </div>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-black text-customNeutral dark:text-white mb-6 flex items-center gap-3">
          <span className="bg-primary/10 p-2 rounded-xl text-primary">📣</span> Share your Eco-Win
        </h3>
        
        <div className="relative group">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What green action did you take today?"
            className="w-full bg-secondary dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 min-h-[140px] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium"
          />
        </div>

        {selectedImage && (
          <div className="mt-4 relative rounded-2xl overflow-hidden aspect-video group">
            <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-primary font-bold text-sm hover:bg-primary/5 px-4 py-3 rounded-2xl transition-all border border-transparent hover:border-primary/10"
            >
              <span>📷</span> <span className="hidden sm:inline">Add Photo</span>
            </button>

            <button 
              onClick={polishCaption}
              disabled={!newPost.trim() || isAILoading}
              className="bg-accent hover:bg-[#f9a825] text-customNeutral px-5 py-3 rounded-2xl font-black text-xs shadow-lg shadow-accent/10 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className={`text-sm ${isAILoading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>✨</span>
              <span>{isAILoading ? 'Polishing...' : 'Spark AI'}</span>
            </button>
          </div>
          
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          
          <button 
            onClick={handlePost}
            disabled={!newPost.trim() && !selectedImage}
            className="bg-primary hover:bg-[#1b5e20] text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            Post Win
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 eco-card animate-slide-up">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-xl overflow-hidden border border-slate-100">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} alt="user" />
                </div>
                <div>
                  <h4 className="font-black text-customNeutral dark:text-white tracking-tight">@{post.username}</h4>
                  <p className="text-[10px] text-customNeutral/40 font-bold uppercase tracking-widest">
                    Recently
                  </p>
                </div>
              </div>
              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Verified Win</div>
            </div>

            <p className="text-customNeutral dark:text-slate-100 text-lg font-medium leading-relaxed mb-6">
              {post.content}
            </p>

            {post.image && (
              <div className="rounded-[2rem] overflow-hidden mb-6 border border-slate-50 shadow-inner group">
                <img src={post.image} className="w-full object-cover max-h-[400px] group-hover:scale-105 transition-transform duration-700" alt="Eco Win" />
              </div>
            )}

            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center gap-8">
               <button 
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-2 transition-all group ${post.hasLiked ? 'text-primary' : 'text-customNeutral/40 dark:text-slate-500 hover:text-primary'}`}
               >
                 <span className={`text-2xl transition-all ${post.hasLiked ? 'animate-pulse-grow' : 'group-hover:scale-125 group-active:scale-90'}`}>🍃</span>
                 <span className="font-black text-sm">{post.likes} reactions</span>
               </button>
               <button className="text-customNeutral/40 dark:text-slate-500 hover:text-primary transition-colors flex items-center gap-2 group">
                 <span className="text-xl group-hover:rotate-12 transition-transform">💬</span>
                 <span className="font-black text-sm">Comment</span>
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EcoFeed;
