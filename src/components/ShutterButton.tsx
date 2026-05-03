import React from 'react';

interface ShutterButtonProps {
  onCapture: () => void;
  disabled?: boolean;
}

const ShutterButton: React.FC<ShutterButtonProps> = ({ onCapture, disabled }) => {
  return (
    <button
      onClick={onCapture}
      disabled={disabled}
      aria-label="Ambil Foto"
      className="group relative flex items-center justify-center focus:outline-none disabled:opacity-50"
    >
      {/* Outer Ring */}
      <div className="w-20 h-20 rounded-full border-[3px] border-white/90 flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-active:scale-90 group-hover:border-brand shadow-2xl">
        {/* Inner Solid Circle */}
        <div className="w-[66px] h-[66px] rounded-full bg-white shadow-xl transition-all duration-500 ease-out group-hover:bg-brand group-active:scale-75" />
      </div>
      
      {/* Animated Rings */}
      <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-brand/30 group-hover:animate-ping opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
      <div className="absolute inset-[-8px] rounded-full bg-brand/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </button>
  );
};


export default ShutterButton;
