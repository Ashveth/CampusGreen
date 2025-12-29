
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string, username: string, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && username && email) {
      setIsSubmitting(true);
      // Simulate a small delay for a premium feel
      setTimeout(() => {
        onLogin(name, username, email);
      }, 800);
    }
  };

  const handleGuestMode = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin('Guest User', 'guest_sprout', 'guest@campusgreen.org');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-primary/20">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-8 border-white animate-fade-in h-auto md:h-[750px] relative">
        
        {/* Left Side: Visual/Branding */}
        <div className="md:w-1/2 bg-primary relative overflow-hidden flex flex-col justify-between p-12 text-white">
          {/* Abstract Nature Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white p-2 rounded-2xl shadow-lg">
                <span className="text-3xl">🌿</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">CampusGreen</h1>
            </div>
            <h2 className="text-5xl font-black leading-tight mb-6">
              Small actions,<br />
              <span className="text-accent">Big Global</span> Impact.
            </h2>
            <p className="text-emerald-50/70 text-lg font-medium max-w-xs leading-relaxed">
              The sustainable lifestyle platform for students and eco-conscious communities.
            </p>
          </div>

          <div className="relative z-10 mt-8 md:mt-0">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-primary bg-white/20 backdrop-blur-sm overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 5}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-50/60">
                1,200+ Eco-warriors active
              </p>
            </div>
          </div>

          {/* Stylized Leaf Overlay */}
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
             <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
               <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.17,20C14.33,20 19,15.33 19,9.17C19,8.76 18.97,8.37 18.92,8H17V8M13,2C7.47,2 3,6.47 3,12C3,13.11 3.18,14.17 3.5,15.17C5.27,10.77 8,7.05 13,5.22V2Z" />
             </svg>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-[#F9FAF7] relative">
          {/* Subtle background texture for the form side */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
          
          <div className="max-w-md mx-auto w-full space-y-8 animate-slide-up relative z-10">
            <div>
              <h3 className="text-3xl font-black text-customNeutral mb-2">Grow with Us</h3>
              <p className="text-customNeutral/50 font-medium italic">"The best time to plant a tree was 20 years ago. The second best time is now."</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-1 ml-4 transition-colors group-focus-within:text-primary">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Green"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-customNeutral placeholder:text-slate-300 shadow-sm"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-1 ml-4 transition-colors group-focus-within:text-primary">Username</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                      placeholder="eco_warrior"
                      className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-6 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-customNeutral placeholder:text-slate-300 shadow-sm"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-1 ml-4 transition-colors group-focus-within:text-primary">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-customNeutral placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-2 border-slate-200 text-primary focus:ring-primary transition-all cursor-pointer" />
                  <span className="text-xs font-bold text-customNeutral/60 group-hover:text-primary transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-xs font-black text-primary hover:text-emerald-700 underline decoration-accent decoration-2 underline-offset-4 transition-colors">Privacy First</button>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-[#1b5e20] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group overflow-hidden"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Start Your Journey</span>
                      <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">🌱</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleGuestMode}
                  className="w-full bg-transparent hover:bg-slate-100 text-customNeutral/60 py-4 rounded-2xl font-bold text-sm transition-all border border-slate-200"
                >
                  Enter as Guest
                </button>
              </div>
            </form>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center justify-center space-x-6">
                 <button className="text-[10px] font-black text-customNeutral/30 uppercase tracking-[0.2em] hover:text-primary transition-colors">Campus Map</button>
                 <div className="h-4 w-px bg-slate-200"></div>
                 <button className="text-[10px] font-black text-customNeutral/30 uppercase tracking-[0.2em] hover:text-primary transition-colors">Resources</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
