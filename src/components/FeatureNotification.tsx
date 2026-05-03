import React, { useState, useEffect } from 'react';

const FeatureNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('snapfx-quad-info');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('snapfx-quad-info', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm bg-brand text-white p-5 rounded-[2rem] shadow-2xl animate-in fade-in slide-in-from-top-8 duration-700">
      <div className="flex items-start space-x-4">
        <div className="bg-white/20 p-3 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 12h18M12 3v18"/>
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-fredoka text-lg font-bold mb-1">Info Baru!</h4>
          <p className="text-sm text-white/80 leading-relaxed mb-4">
            Mode <span className="font-bold underline">Quad Cam</span> sekarang bisa dikombinasikan dengan SEMUA efek! Aktifkan di menu Settings.
          </p>
          <button 
            onClick={handleClose}
            className="w-full py-2 bg-white text-brand font-bold rounded-xl hover:bg-zinc-100 transition-colors active:scale-95"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureNotification;
