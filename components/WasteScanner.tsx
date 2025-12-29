
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface WasteScannerProps {
  onComplete: () => void;
}

const WasteScanner: React.FC<WasteScannerProps> = ({ onComplete }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ category: string; advice: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setError(null);
    } catch (err) {
      setError("Camera access denied. Please enable permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  };

  const scanItem = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      // Fix: Always initialize GoogleGenAI with named parameter apiKey from process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        // Fix: contents must be an object with a parts array for multimodal input
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
              },
            },
            {
              text: "Analyze this item and tell me if it should be recycled, composted, or put in landfill. Format your response as a JSON object with 'category' (Recycle, Compost, Landfill) and 'advice' (1-sentence explanation).",
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
        }
      });

      // Fix: response.text is a property getter, not a method
      const parsed = JSON.parse(response.text || '{}');
      setResult(parsed);
      stopCamera();
    } catch (err) {
      setError("AI analysis failed. Try a clearer photo.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualLog = () => {
    setIsLogging(true);
    // Simulate a logging delay
    setTimeout(() => {
      setIsLogging(false);
      onComplete();
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white dark:border-slate-800">
        <div className="p-8 bg-primary dark:bg-slate-800 text-white">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <span>📸</span> Waste Scanner
          </h2>
          <p className="text-emerald-50/60 text-xs font-bold uppercase tracking-widest mt-1">Instant sorting advice powered by Gemini</p>
        </div>

        <div className="p-8">
          {!stream && !result ? (
            <div className="flex flex-col items-center justify-center h-64 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl space-y-4">
              <span className="text-6xl grayscale opacity-20">♻️</span>
              <button 
                onClick={startCamera}
                className="bg-primary hover:bg-[#1b5e20] text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all"
              >
                Launch Scanner
              </button>
            </div>
          ) : result ? (
            <div className="space-y-6 text-center animate-slide-up">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white text-4xl shadow-xl mb-4 ${
                result.category === 'Recycle' ? 'bg-blue-500' : result.category === 'Compost' ? 'bg-primary' : 'bg-customNeutral'
              }`}>
                {result.category === 'Recycle' ? '♻️' : result.category === 'Compost' ? '🍎' : '🗑️'}
              </div>
              <div>
                <h3 className="text-3xl font-black text-customNeutral dark:text-white uppercase tracking-tighter">
                  {result.category}
                </h3>
                <p className="mt-4 text-customNeutral/60 dark:text-slate-400 font-medium leading-relaxed italic">
                  "{result.advice}"
                </p>
              </div>
              
              <div className="pt-6 space-y-3">
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setResult(null); startCamera(); }}
                    className="flex-1 bg-secondary dark:bg-slate-800 text-customNeutral dark:text-white py-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Scan Another
                  </button>
                  <button 
                    onClick={onComplete}
                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-[#1b5e20] transition-colors"
                  >
                    Finish
                  </button>
                </div>
                
                {/* Manually Log Recycle Button - positioned below the 'Scan Another' row */}
                <button 
                  onClick={handleManualLog}
                  disabled={isLogging}
                  className="w-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-4 rounded-2xl font-black border-2 border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center justify-center gap-2 group"
                >
                  {isLogging ? (
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="group-hover:rotate-12 transition-transform">♻️</span>
                      Manually Log Recycle
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-square shadow-2xl group">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-[16px] border-white/10 pointer-events-none"></div>
              
              {/* Scan Line Animation */}
              {isScanning && (
                <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_20px_#FBC02D] animate-[scan_2s_linear_infinite]"></div>
              )}

              <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6">
                <button 
                  onClick={scanItem}
                  disabled={isScanning}
                  className="w-full bg-white text-primary py-4 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isScanning ? (
                    <div className="w-6 h-6 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  ) : (
                    <><span>🔍</span> Analyze Item</>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-red-500 text-center font-bold text-sm">{error}</p>}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(350px); }
        }
      `}</style>
    </div>
  );
};

export default WasteScanner;
