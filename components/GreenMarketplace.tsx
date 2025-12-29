import React, { useState, useMemo, useRef } from 'react';
import { User, MarketItem } from '../types';

interface MarketplaceProps {
  user: User;
}

type SortOption = 'Newest' | 'Name' | 'Type';

const GreenMarketplace: React.FC<MarketplaceProps> = ({ user }) => {
  const [items, setItems] = useState<MarketItem[]>([
    { 
      id: 'm1', 
      title: 'Macroeconomics 101', 
      description: 'Gently used textbook, 12th edition. Essential for freshman year! Minimal highlighting.', 
      category: 'Books', 
      type: 'Giveaway', 
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'prof_oak' 
    },
    { 
      id: 'm2', 
      title: 'Eco Coffee Maker', 
      description: 'Works perfect, just graduated and moving out. Includes reusable filter!', 
      category: 'Dorm', 
      type: 'Swap', 
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'grad_jen' 
    },
    { 
      id: 'm3', 
      title: 'Campus Heritage Hoodie', 
      description: 'Size Medium, barely worn. Super cozy for those late nights in the library!', 
      category: 'Clothing', 
      type: 'Giveaway', 
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'freshman_fred' 
    },
    { 
      id: 'm4', 
      title: 'Architectural Desk Lamp', 
      description: 'Modern minimalist design with adjustable arm. Includes LED bulb. Perfect for drafting or late-night study sessions.', 
      category: 'Dorm', 
      type: 'Giveaway', 
      image: 'https://images.unsplash.com/photo-1534073828943-f801091bb270?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'night_owl' 
    },
    { 
      id: 'm5', 
      title: 'Franklin Graphing Calculator', 
      description: 'Model FGC-100. High-resolution 2.5" LCD screen, multi-line display. Essential for advanced mathematics and engineering courses.', 
      category: 'Electronics', 
      type: 'Swap', 
      image: 'https://images.unsplash.com/photo-1574607383476-f517f220d398?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'math_wiz' 
    },
    { 
      id: 'm6', 
      title: 'Compact Air Fryer', 
      description: 'Used for one semester. Makes the best frozen fries without all the oil! Easy to clean.', 
      category: 'Dorm', 
      type: 'Swap', 
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'chef_alex' 
    },
    { 
      id: 'm7', 
      title: 'Calculus II (Apostol)', 
      description: 'Second Edition, Volume II. Comprehensive guide for mathematical analysis. Excellent condition, vital for math majors.', 
      category: 'Books', 
      type: 'Swap', 
      image: 'https://images.unsplash.com/photo-1543004629-141a4456934e?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'engineer_stu' 
    },
    { 
      id: 'm8', 
      title: 'Energy Star Mini Fridge', 
      description: 'Extremely quiet and energy efficient. Fits perfectly under a standard dorm bed.', 
      category: 'Dorm', 
      type: 'Swap', 
      image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'cool_katie' 
    },
    { 
      id: 'm9', 
      title: 'Vintage Denim Jacket', 
      description: 'Thrifted but high quality. Classic look, size Large. Perfect for fall layers.', 
      category: 'Clothing', 
      type: 'Giveaway', 
      image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'retro_ryan' 
    },
    { 
      id: 'm10', 
      title: 'Portable JBL Speaker', 
      description: 'Waterproof and great bass. Perfect for campus picnics or study groups.', 
      category: 'Electronics', 
      type: 'Swap', 
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'music_mike' 
    },
    { 
      id: 'm11', 
      title: 'Organic Cotton Totebag', 
      description: 'Large capacity, heavy duty. Stop using plastic bags at the campus market!', 
      category: 'Clothing', 
      type: 'Giveaway', 
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'eco_emily' 
    },
    { 
      id: 'm12', 
      title: 'Chemistry Lab Coat', 
      description: 'Professional grade white lab coat. Size Small/Medium. Minimal use, no chemical stains. Ready for your next lab.', 
      category: 'Clothing', 
      type: 'Giveaway', 
      image: 'https://images.unsplash.com/photo-1581093583449-80dca0db24b8?auto=format&fit=crop&q=80&w=800', 
      ownerUsername: 'chem_major' 
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('Newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  
  const [zoomItem, setZoomItem] = useState<MarketItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  
  const [swapProposal, setSwapProposal] = useState('');
  const [inquiryText, setInquiryText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'Books' as MarketItem['category'],
    type: 'Giveaway' as MarketItem['type'],
    image: ''
  });

  const categories = ['All', 'Books', 'Dorm', 'Clothing', 'Electronics'];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=400';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadPreview(base64);
        setNewItem(prev => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: MarketItem = {
      id: `m${Date.now()}`,
      ...newItem,
      image: newItem.image || 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=400',
      ownerUsername: user.username
    };
    setItems([item, ...items]);
    setIsModalOpen(false);
    setUploadPreview(null);
    setNewItem({ title: '', description: '', category: 'Books', type: 'Giveaway', image: '' });
  };

  const openSwap = (item: MarketItem) => {
    setSelectedItem(item);
    setIsSwapModalOpen(true);
  };

  const openInquiry = (item: MarketItem) => {
    setSelectedItem(item);
    setIsInquiryModalOpen(true);
  };

  const openBuy = (item: MarketItem) => {
    setSelectedItem(item);
    setIsBuyModalOpen(true);
  };

  const handleActionComplete = (msg: string) => {
    alert(msg);
    setIsSwapModalOpen(false);
    setIsInquiryModalOpen(false);
    setIsBuyModalOpen(false);
    setSelectedItem(null);
    setSwapProposal('');
    setInquiryText('');
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];
    if (activeFilter !== 'All') {
      result = result.filter(i => i.category === activeFilter);
    }
    result.sort((a, b) => {
      if (sortBy === 'Name') return a.title.localeCompare(b.title);
      if (sortBy === 'Type') return a.type.localeCompare(b.type);
      if (sortBy === 'Newest') return b.id.localeCompare(a.id);
      return 0;
    });
    return result;
  }, [items, activeFilter, sortBy]);

  return (
    <div className="space-y-10 animate-fade-in relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-primary/10 pb-10">
        <div>
          <h2 className="text-5xl font-black text-customNeutral dark:text-slate-100 tracking-tighter uppercase">Green Market</h2>
          <p className="text-customNeutral/60 dark:text-slate-400 font-medium mt-2 max-w-lg">
            Empowering the campus circular economy. List what you don't need, find what you do.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-[#1b5e20] text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">📦</span> 
          <span>List an Item</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="flex overflow-x-auto gap-3 pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${
                activeFilter === cat 
                  ? 'bg-primary border-primary text-white shadow-xl scale-105' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-customNeutral/50 dark:text-slate-400 hover:border-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-black text-customNeutral/30 uppercase tracking-widest whitespace-nowrap">Sort By</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent border-none focus:ring-0 text-xs font-black text-primary uppercase tracking-wider outline-none cursor-pointer"
          >
            <option value="Newest">Newest</option>
            <option value="Name">A-Z Name</option>
            <option value="Type">Exchange Type</option>
          </select>
        </div>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
        {filteredAndSortedItems.map(item => (
          <div key={item.id} className="break-inside-avoid bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden eco-card flex flex-col group hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2)] hover:border-primary/40 hover:scale-[1.03] transition-all duration-500 ease-out">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm group-hover:border-primary/20 transition-all">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.ownerUsername}`} alt="owner" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-black text-customNeutral dark:text-slate-200 tracking-tight group-hover:text-primary transition-colors">@{item.ownerUsername}</span>
              </div>
              <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                item.type === 'Giveaway' 
                  ? 'bg-accent/10 text-accent-700 group-hover:bg-accent/20' 
                  : 'bg-primary/10 text-primary group-hover:bg-primary/20'
              }`}>
                {item.type}
              </div>
            </div>

            <button 
              onClick={() => setZoomItem(item)}
              className="relative overflow-hidden bg-slate-100 aspect-[4/3] w-full block focus:outline-none"
            >
               <img 
                 src={item.image} 
                 onError={handleImageError}
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-105" 
                 alt={item.title} 
               />
               <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-primary font-black text-[10px] uppercase tracking-widest shadow-xl scale-90 group-hover:scale-100 transition-transform">🔍 Click to zoom</span>
               </div>
               <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <span className="text-primary text-sm animate-pulse">🌱</span>
                  <span className="text-[9px] font-black text-customNeutral dark:text-white uppercase tracking-widest">Circular Choice</span>
               </div>
            </button>
            
            <div className="p-8 flex-grow flex flex-col group-hover:bg-primary/[0.01] transition-colors duration-500">
               <div className="flex items-center gap-2 mb-4">
                 <span className="px-3 py-1 bg-secondary dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 group-hover:shadow-md transition-all duration-300 transform-gpu">
                   {item.category}
                 </span>
               </div>
               
               <h4 className="text-2xl font-black text-customNeutral dark:text-white tracking-tighter mb-3 leading-tight group-hover:text-primary group-hover:scale-[1.02] origin-left transition-all duration-300 transform-gpu">
                 {item.title}
               </h4>
               
               <p className="text-sm text-customNeutral/60 dark:text-slate-400 font-medium mb-8 leading-relaxed line-clamp-3 group-hover:text-customNeutral dark:group-hover:text-slate-200 transition-colors">
                 {item.description}
               </p>
               
               <div className="mt-auto space-y-3">
                 <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => openSwap(item)}
                      className="bg-primary text-white py-4 rounded-2xl font-black transition-all border border-primary flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:bg-[#1b5e20] active:scale-95 text-[10px] uppercase tracking-widest"
                    >
                      🔄 Swap
                    </button>
                    <button 
                      onClick={() => openBuy(item)}
                      className="bg-accent text-customNeutral py-4 rounded-2xl font-black transition-all border border-accent flex items-center justify-center gap-2 shadow-lg shadow-accent/10 hover:bg-[#f9a825] active:scale-95 text-[10px] uppercase tracking-widest"
                    >
                      🏷️ {item.type === 'Giveaway' ? 'Claim' : 'Commit'}
                    </button>
                 </div>
                 <button 
                  onClick={() => openInquiry(item)}
                  className="w-full bg-white dark:bg-slate-800 hover:bg-secondary dark:hover:bg-slate-700 text-customNeutral dark:text-white py-4 rounded-2xl font-black transition-all border border-slate-100 dark:border-slate-700 flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
                 >
                   💬 Inquire Now
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-customNeutral/80 backdrop-blur-md animate-fade-in" onClick={() => setIsInquiryModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border-8 border-white dark:border-slate-800">
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-tighter uppercase">Inquire About Item</h3>
              <button onClick={() => setIsInquiryModalOpen(false)} className="text-2xl opacity-50 hover:opacity-100">✕</button>
            </div>
            <div className="p-10 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                 <img src={selectedItem.image} onError={handleImageError} className="w-16 h-16 rounded-xl object-cover" />
                 <div>
                    <h4 className="font-black dark:text-white">{selectedItem.title}</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-300 font-bold">Ask @{selectedItem.ownerUsername} a question</p>
                 </div>
              </div>
              <textarea 
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="Hi! Is this still available? Where can we meet?"
                className="w-full bg-secondary dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 min-h-[140px] focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all dark:text-white font-medium"
              />
              <button 
                onClick={() => handleActionComplete(`Message sent to @${selectedItem.ownerUsername}!`)}
                disabled={!inquiryText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy/Claim Modal */}
      {isBuyModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-customNeutral/80 backdrop-blur-md animate-fade-in" onClick={() => setIsBuyModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border-8 border-white dark:border-slate-800">
            <div className="p-8 bg-accent text-customNeutral flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-tighter uppercase">{selectedItem.type === 'Giveaway' ? 'Claim for Free' : 'Commit to Item'}</h3>
              <button onClick={() => setIsBuyModalOpen(false)} className="text-2xl opacity-50 hover:opacity-100">✕</button>
            </div>
            <div className="p-10 space-y-8 text-center">
              <div className="flex flex-col items-center">
                <img src={selectedItem.image} onError={handleImageError} className="w-32 h-32 rounded-3xl object-cover shadow-2xl mb-4 border-4 border-accent/20" />
                <h4 className="text-3xl font-black dark:text-white tracking-tight">{selectedItem.title}</h4>
                <p className="text-sm font-bold text-customNeutral/40 uppercase tracking-widest mt-1">Owned by @{selectedItem.ownerUsername}</p>
              </div>
              <div className="bg-secondary dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 text-left">
                 <p className="text-xs font-bold text-customNeutral/60 dark:text-slate-400 leading-relaxed mb-4">
                   {selectedItem.type === 'Giveaway' 
                     ? "This item is a giveaway! By claiming it, you agree to pick it up at a safe location agreed upon with the owner."
                     : "This item is listed for swap or negotiation. By committing, you express serious interest in acquiring it."}
                 </p>
                 <div className="flex items-center gap-3 text-primary">
                    <span className="text-2xl">🌍</span>
                    <span className="text-xs font-black uppercase tracking-widest">Saving 2.5kg of CO2 emissions</span>
                 </div>
              </div>
              <button 
                onClick={() => handleActionComplete(`${selectedItem.type === 'Giveaway' ? 'Item Claimed' : 'Interest Logged'}! Check your notifications to coordinate pickup.`)}
                className="w-full bg-accent hover:bg-[#f9a825] text-customNeutral py-6 rounded-3xl font-black text-lg shadow-xl shadow-accent/20 transition-all active:scale-95 uppercase tracking-widest"
              >
                {selectedItem.type === 'Giveaway' ? 'Confirm Claim' : 'Express Interest'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swap Modal */}
      {isSwapModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-xl animate-fade-in" onClick={() => setIsSwapModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border-8 border-primary/10">
            <div className="p-10 bg-primary text-white flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase">Propose a Swap</h3>
                <p className="text-emerald-50/60 text-[10px] font-bold uppercase tracking-widest mt-1">Trading for: {selectedItem.title}</p>
              </div>
              <button onClick={() => setIsSwapModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors text-2xl">✕</button>
            </div>
            <div className="p-10 space-y-8">
              <div className="flex items-center gap-6 p-4 bg-secondary dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <img src={selectedItem.image} onError={handleImageError} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt="target" />
                <div>
                  <h4 className="font-black text-customNeutral dark:text-white">{selectedItem.title}</h4>
                  <p className="text-xs font-bold text-customNeutral/40 uppercase tracking-widest">Owned by @{selectedItem.ownerUsername}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-primary uppercase tracking-widest ml-4">What are you offering?</label>
                <textarea 
                  required
                  value={swapProposal}
                  onChange={(e) => setSwapProposal(e.target.value)}
                  placeholder={`Tell @${selectedItem.ownerUsername} what you'd like to trade...`}
                  className="w-full bg-secondary dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium min-h-[140px]"
                />
              </div>
              <button 
                onClick={() => handleActionComplete(`Swap proposal sent to @${selectedItem.ownerUsername}!`)}
                disabled={!swapProposal.trim()}
                className="w-full bg-primary hover:bg-[#1b5e20] text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest"
              >
                Send Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-customNeutral/80 backdrop-blur-xl animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border-8 border-white/10">
            <div className="p-10 bg-primary dark:bg-slate-800 text-white flex justify-between items-center">
               <div>
                 <h3 className="text-3xl font-black tracking-tighter uppercase">List Your Gear</h3>
                 <p className="text-emerald-50/60 text-[10px] font-bold uppercase tracking-widest mt-1">Help keep the circle spinning</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors text-2xl">✕</button>
            </div>
            <form onSubmit={handleListItem} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-primary uppercase tracking-widest ml-4">Item Name</label>
                  <input 
                    required
                    value={newItem.title}
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                    placeholder="e.g. Vintage Denim Jacket"
                    className="w-full bg-secondary dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-primary uppercase tracking-widest ml-4">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                    className="w-full bg-secondary dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-bold appearance-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-primary uppercase tracking-widest ml-4">Description</label>
                <textarea 
                  required
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Share details about the condition..."
                  className="w-full bg-secondary dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-primary uppercase tracking-widest ml-4">Upload Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary dark:hover:bg-slate-800 transition-all group"
                >
                  {uploadPreview ? (
                    <img src={uploadPreview} className="w-full h-40 object-cover rounded-2xl shadow-xl" />
                  ) : (
                    <>
                      <span className="text-5xl mb-3 opacity-20 group-hover:scale-110 transition-transform">📸</span>
                      <span className="text-xs font-black text-customNeutral/40 uppercase tracking-widest">Click to upload photo</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-primary uppercase tracking-widest ml-4">Exchange Type</label>
                <div className="flex gap-3">
                  {['Giveaway', 'Swap'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewItem({...newItem, type: t as any})}
                      className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                        newItem.type === t 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'bg-secondary dark:bg-slate-800 text-customNeutral/40 border-2 border-slate-50 dark:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-[#1b5e20] text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest">
                Create Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {zoomItem && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-customNeutral/90 backdrop-blur-2xl animate-fade-in" onClick={() => setZoomItem(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl h-fit max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden animate-slide-up border-8 border-white/10 flex flex-col md:flex-row">
             <div className="md:w-3/5 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                <img src={zoomItem.image} onError={handleImageError} className="w-full h-full object-contain" alt={zoomItem.title} />
             </div>
             <div className="md:w-2/5 p-12 flex flex-col justify-between">
                <div>
                   <button onClick={() => setZoomItem(null)} className="absolute top-8 right-8 text-customNeutral/40 hover:text-primary transition-colors text-3xl">✕</button>
                   <div className="flex items-center gap-3 mb-6">
                      <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {zoomItem.category}
                      </span>
                      <span className="px-4 py-1.5 bg-accent/10 text-accent-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {zoomItem.type}
                      </span>
                   </div>
                   <h3 className="text-4xl font-black text-customNeutral dark:text-white tracking-tighter mb-4 leading-none">{zoomItem.title}</h3>
                   <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${zoomItem.ownerUsername}`} alt="owner" />
                      </div>
                      <span className="font-bold text-customNeutral/60 dark:text-slate-400">Listed by <span className="text-primary font-black">@{zoomItem.ownerUsername}</span></span>
                   </div>
                   <p className="text-lg text-customNeutral/70 dark:text-slate-300 font-medium leading-relaxed mb-10">
                      {zoomItem.description}
                   </p>
                </div>
                <div className="space-y-4">
                   <button 
                     onClick={() => { openSwap(zoomItem); setZoomItem(null); }}
                     className="w-full bg-primary text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                      <span>🔄</span> Propose Swap
                   </button>
                   <p className="text-center text-[10px] font-black text-customNeutral/30 uppercase tracking-[0.2em]">Safe exchanges in the Student Union</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {filteredAndSortedItems.length === 0 && (
        <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
           <span className="text-7xl block mb-6 grayscale opacity-20">🛒</span>
           <p className="text-xl font-bold text-customNeutral/30 uppercase tracking-[0.2em]">No items found in this category</p>
        </div>
      )}

      <div className="bg-customNeutral dark:bg-slate-900 p-12 rounded-[4rem] text-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] mt-20 border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -mr-64 -mt-64 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
           <div className="text-center lg:text-left flex-1">
             <div className="inline-block bg-accent text-customNeutral px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-accent/20">Zero Waste Fact</div>
             <h3 className="text-5xl font-black mb-6 tracking-tighter leading-tight">Reduce the <span className="text-primary italic">Demand</span>.</h3>
             <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl">
               Buying one used item instead of new saves an average of <span className="text-white">2.5kg of carbon emissions</span>. Our campus marketplace has already prevented over <span className="text-primary">2 tons</span> of landfill waste this semester.
             </p>
           </div>
           <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 text-center min-w-[300px] shadow-2xl">
              <div className="text-7xl font-black text-accent mb-3 tracking-tighter">92%</div>
              <p className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-300">Reuse Success Rate</p>
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-2">
                 <div className="text-[10px] font-bold text-emerald-50/50 uppercase">Collective Progress</div>
                 <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_15px_#2E7D32]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GreenMarketplace;
