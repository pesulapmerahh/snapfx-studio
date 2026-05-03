import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { Photo } from '../context/AppContext';

interface GalleryStripProps {
  onSelectPhoto: (photo: Photo) => void;
}

const GalleryStrip: React.FC<GalleryStripProps> = ({ onSelectPhoto }) => {
  const { photos } = useAppContext();

  if (photos.length === 0) return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-center justify-center text-zinc-700 shadow-inner group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-zinc-500 transition-colors">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      </div>
      <span className="text-[8px] uppercase tracking-tighter text-zinc-600 mt-1 font-bold">Kosong</span>
    </div>
  );

  return (
    <div className="relative group/gallery">
      <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1 px-1 -mx-1 max-w-[140px] md:max-w-md">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => onSelectPhoto(photo)}
            className="relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-white/10 hover:border-brand/50 hover:ring-4 hover:ring-brand/20 transition-all active:scale-95 shadow-lg group/item animate-in slide-in-from-left-4 duration-500"
            style={{ 
              animationDelay: `${index * 50}ms`,
              zIndex: photos.length - index 
            }}
          >
            <img 
              src={photo.dataUrl} 
              alt="Captured" 
              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300 scale-50 group-hover/item:scale-100">
              <div className="bg-brand/90 p-1.5 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Subtle indicator if more items */}
      {photos.length > 2 && (
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none opacity-0 group-hover/gallery:opacity-100 transition-opacity" />
      )}
    </div>
  );
};

export default GalleryStrip;

