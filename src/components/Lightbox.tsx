import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { Photo } from '../context/AppContext';

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ photo, onClose }) => {
  const { removePhoto } = useAppContext();

  if (!photo) return null;

  const handleShare = async () => {
    if (!photo) return;

    if (typeof navigator.share === 'function') {
      try {
        const response = await fetch(photo.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `snapfx-${photo.timestamp}.jpg`, { type: 'image/jpeg' });

        await navigator.share({
          files: [file],
          title: 'SnapFX Selfie',
          text: 'Lihat hasil selfie keren saya dengan SnapFX!',
        });
      } catch (err) {
        // Silent fail or handle otherwise
      }
    } else {
      const link = document.createElement('a');
      link.href = photo.dataUrl;
      link.download = `snapfx-${photo.timestamp}.jpg`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/98 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
      <header className="flex items-center justify-between p-6">
        <button 
          onClick={onClose}
          className="p-3 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">SnapFX Original</span>
          <span className="text-white/60 text-[10px] font-bold uppercase">{photo.filter} Effect</span>
        </div>
        <button 
          onClick={() => {
            removePhoto(photo.id);
            onClose();
          }}
          className="p-3 text-brand hover:bg-brand/10 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
          </svg>
        </button>
      </header>

      <div className="flex-1 min-h-0 flex items-center justify-center p-4">
        <img 
          src={photo.dataUrl} 
          alt="Full size" 
          className="max-w-full max-h-full rounded-lg shadow-2xl object-contain border border-white/10" 
        />
      </div>

      <footer className="p-8 flex flex-col md:flex-row items-center justify-center gap-4 bg-gradient-to-t from-black to-transparent">
        <button
          onClick={handleShare}
          className="w-full md:w-auto px-10 py-4 bg-brand text-white font-bold rounded-2xl hover:bg-brand-hover transition-all active:scale-95 flex items-center justify-center space-x-3 shadow-xl shadow-brand/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
          </svg>
          <span>{typeof navigator.share === 'function' ? 'Bagikan Foto' : 'Unduh Sekarang'}</span>
        </button>

        <a
          href={photo.dataUrl}
          download={`snapfx-${photo.timestamp}.jpg`}
          className="w-full md:w-auto px-10 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all active:scale-95 flex items-center justify-center space-x-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <span>Unduh JPG</span>
        </a>
      </footer>
    </div>
  );
};

export default Lightbox;
