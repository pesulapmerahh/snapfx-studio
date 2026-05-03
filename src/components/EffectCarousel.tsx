import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { EffectType } from './EffectEngine';

const effects: { id: EffectType; label: string; icon: string; category: string }[] = [
  { id: 'none', label: 'Normal', icon: '✨', category: 'Basic' },
  { id: 'grayscale', label: 'B&W', icon: '🌑', category: 'Basic' },
  { id: 'sepia', label: 'Vintage', icon: '🎞️', category: 'Basic' },
  { id: 'invert', label: 'X-Ray', icon: '💀', category: 'Basic' },
  { id: 'noir', label: 'Film Noir', icon: '🎬', category: 'Basic' },

  { id: 'mirror_lr', label: 'Mirror L-R', icon: '↔️', category: 'Geometric' },
  { id: 'mirror_tb', label: 'Mirror T-B', icon: '↕️', category: 'Geometric' },
  { id: 'kaleidoscope', label: 'Kaleido', icon: '💠', category: 'Geometric' },
  { id: 'pixel', label: '8-Bit', icon: '🔲', category: 'Geometric' },

  { id: 'bulge', label: 'Bulge', icon: '🪞', category: 'Distort' },
  { id: 'swirl', label: 'Swirl', icon: '🌀', category: 'Distort' },
  { id: 'glitch', label: 'Glitch', icon: '📡', category: 'Distort' },
  { id: 'vhs', label: 'VHS', icon: '📼', category: 'Distort' },
  { id: 'blur', label: 'Dreamy', icon: '☁️', category: 'Distort' },
  { id: 'prism', label: 'Prism', icon: '🔷', category: 'Distort' },

  { id: 'vignette', label: 'Drama', icon: '🎯', category: 'Mood' },
  { id: 'duotone', label: 'Wave', icon: '🌊', category: 'Mood' },
  { id: 'sunset', label: 'Golden', icon: '🌇', category: 'Mood' },
  { id: 'midnight', label: 'Midnight', icon: '🌙', category: 'Mood' },
  { id: 'infrared', label: 'IR Glow', icon: '🔴', category: 'Mood' },
  { id: 'emboss', label: 'Steel', icon: '⚙️', category: 'Mood' },
  { id: 'scanlines', label: 'CRT TV', icon: '📺', category: 'Mood' },

  { id: 'comic_strip', label: 'Comic Strip', icon: '📰', category: 'Art' },
  { id: 'litho', label: 'Lithograph', icon: '🖼️', category: 'Art' },

  { id: 'thermal', label: 'Thermal', icon: '🌡️', category: 'Color' },
  { id: 'popart', label: 'Pop Art', icon: '🎨', category: 'Color' },
  { id: 'comic', label: 'Ink', icon: '💮', category: 'Color' },
  { id: 'acid', label: 'Acid', icon: '🧪', category: 'Color' },
  { id: 'neon', label: 'Neon Night', icon: '✴️', category: 'Color' },
];

const EffectCarousel: React.FC = () => {
  const { activeEffect, setActiveEffect } = useAppContext();

  return (
    <div className="relative mx-auto w-full max-w-2xl px-2 pb-2 pt-1 select-none">
      <div className="effect-carousel-scroll w-full overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex min-h-[110px] min-w-max items-center gap-5 px-6">
          {effects.map((effect) => (
            <button
              key={effect.id}
              type="button"
              onClick={() => setActiveEffect(effect.id)}
              className={`group flex flex-col items-center transition-all duration-500 ${
                activeEffect === effect.id ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-500 backdrop-blur-sm ${
                  activeEffect === effect.id
                    ? 'border-brand bg-brand/10 text-brand shadow-[0_0_20px_rgba(255,77,77,0.2)]'
                    : 'border-white/5 bg-white/5 text-zinc-400 group-hover:border-white/15'
                }`}
              >
                <span className="relative z-10 text-xl">{effect.icon}</span>
                {activeEffect === effect.id && (
                  <div className="absolute inset-[-2px] rounded-2xl border-2 border-white/20 animate-pulse" />
                )}
              </div>
              
              <div className="mt-2.5 flex flex-col items-center">
                <span
                  className={`text-[7px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                    activeEffect === effect.id ? 'text-brand' : 'text-zinc-600'
                  }`}
                >
                  {effect.category}
                </span>
                <span
                  className={`text-[10px] font-bold mt-0.5 transition-colors duration-300 ${
                    activeEffect === effect.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {effect.label}
                </span>
              </div>
              
              {activeEffect === effect.id && (
                <div className="w-1 h-1 bg-brand rounded-full mt-1 animate-bounce" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EffectCarousel;
