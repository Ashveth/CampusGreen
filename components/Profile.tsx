
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { BADGES } from '../constants';

interface ProfileProps {
  user: User;
  onUpdate: (name: string, username: string, avatarUrl: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatarUrl || '');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Could not access camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setAvatar(dataUrl);
        stopCamera();
      }
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please upload an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Fix: React uses DragEvent for both onDragOver and onDrop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const resetToDefault = () => {
    setAvatar('');
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const currentAvatarUrl = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 h-fit">
        {/* Header / Banner */}
        <div className="p-10 bg-primary dark:bg-slate-800 text-white flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div className="relative group mb-6 z-10">
            <div className="w-36 h-36 rounded-full border-4 border-white dark:border-slate-700 overflow-hidden bg-secondary shadow-xl relative flex items-center justify-center transition-all duration-500">
              {avatar ? (
                <img 
                  src={avatar} 
                  className="w-full h-full object-cover animate-fadeIn" 
                  alt="Profile" 
                />
              ) : (
                <img 
                  src={currentAvatarUrl} 
                  className="w-full h-full object-cover animate-fadeIn opacity-80" 
                  alt="Default Profile" 
                />
              )}
              
              {avatar && (
                <button 
                  onClick={(e) => { e.stopPropagation(); resetToDefault(); }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors z-20"
                  title="Remove custom photo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div 
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full cursor-pointer z-10" 
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-white text-sm font-bold">Change Photo</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold z-10">{name || user.name}</h2>
          <p className="text-accent font-bold mt-1 uppercase tracking-widest text-xs z-10">@{username || user.username} • {user.points} Eco Points</p>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-primary dark:text-primary uppercase tracking-widest ml-4">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary dark:text-white transition-all outline-none font-bold text-lg"
                placeholder="Full Name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-primary dark:text-primary uppercase tracking-widest ml-4">Username</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                  className="w-full bg-secondary dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl pl-10 pr-6 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary dark:text-white transition-all outline-none font-bold text-lg"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-primary dark:text-primary uppercase tracking-widest ml-4">Update Profile Photo</label>
            {!isCameraActive ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-3xl transition-all text-customNeutral dark:text-slate-400 group h-32 ${
                    isDragging 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-secondary dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📁</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">Upload</span>
                </button>

                <button 
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl hover:bg-secondary dark:hover:bg-slate-800 transition-all text-customNeutral dark:text-slate-400 group h-32"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">Camera</span>
                </button>

                <button 
                  onClick={resetToDefault}
                  disabled={!avatar}
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-3xl transition-all group h-32 ${
                    avatar 
                      ? 'border-slate-200 dark:border-slate-700 hover:bg-secondary dark:hover:bg-slate-800 text-customNeutral dark:text-slate-400' 
                      : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  }`}
                >
                  <span className="text-3xl mb-2">🔄</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">Reset</span>
                </button>
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-video shadow-2xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-6">
                  <button onClick={capturePhoto} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-xl">Snap</button>
                  <button onClick={stopCamera} className="bg-white/20 text-white px-8 py-3 rounded-2xl font-bold backdrop-blur-xl">Cancel</button>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => onUpdate(name, username, avatar)}
              className="w-full bg-primary hover:bg-[#1b5e20] text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group flex items-center justify-center gap-3"
            >
              <span>Save Changes</span>
              <span className="group-hover:translate-x-1 transition-transform">✨</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-black text-customNeutral dark:text-white mb-6">Earned Badges</h3>
          <div className="grid grid-cols-2 gap-4">
             {BADGES.map(badge => {
               const isOwned = user.points >= badge.requirement;
               return (
                 <div 
                   key={badge.id} 
                   className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${
                     isOwned 
                       ? 'bg-primary/5 border-primary/20 shadow-sm' 
                       : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-40 grayscale'
                   }`}
                 >
                   <span className="text-4xl mb-2">{badge.icon}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-customNeutral dark:text-white">{badge.name}</span>
                 </div>
               );
             })}
          </div>
        </div>

        <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          <h3 className="text-xl font-black mb-2">Next Milestone</h3>
          <p className="text-emerald-50/70 text-sm font-medium mb-6">Keep growing your impact!</p>
          <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden">
             <div 
               className="bg-accent h-full transition-all duration-1000" 
               style={{ width: `${Math.min((user.points / 1000) * 100, 100)}%` }}
             ></div>
          </div>
          <p className="mt-4 text-xs font-black uppercase text-accent tracking-widest">{user.points} / 1000 Total Points</p>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Profile;
