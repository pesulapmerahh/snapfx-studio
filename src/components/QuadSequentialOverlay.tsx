import React from 'react';

/** Urutan sama dengan captureQuadrant: 0=kir atas, 1=kan atas, 2=kir bawah, 3=kan bawah */
type QuadPanels = readonly [string | null, string | null, string | null, string | null];

interface QuadSequentialOverlayProps {
  panels: QuadPanels;
}

/**
 * Strip preview 4 slot untuk mode quad berurutan.
 * Didesain lebih elegan dengan glassmorphism dan indikator LIVE.
 */
const QuadSequentialOverlay: React.FC<QuadSequentialOverlayProps> = ({ panels }) => {
  const nextEmptySlot = panels.findIndex((slot) => slot === null);
  const labels = ['Kiri Atas', 'Kanan Atas', 'Kiri Bawah', 'Kanan Bawah'] as const;

  return (
    <div className="pointer-events-none absolute left-1/2 top-16 sm:top-6 z-[31] w-[min(94vw,560px)] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/70 p-2.5 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="grid grid-cols-4 gap-2.5">
      {([0, 1, 2, 3] as const).map((i) => {
        const src = panels[i];
        const isNext = src === null && nextEmptySlot === i;
        const isFilled = src !== null;

        return (
          <div
            key={i}
            style={{ aspectRatio: '16/9' }}
            className={`relative min-h-[60px] sm:min-h-[80px] overflow-hidden rounded-xl transition-all duration-300 ${
              isNext 
                ? 'ring-2 ring-brand shadow-[0_0_20px_rgba(255,77,77,0.4)] bg-zinc-900' 
                : 'ring-1 ring-white/10 bg-zinc-950/80'
            }`}
          >
            {isFilled ? (
              <div className="group relative h-full w-full animate-in zoom-in-95 duration-300">
                <img
                  src={src}
                  alt=""
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  className="block"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute left-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[8px] font-black text-white shadow-lg">
                  {i + 1}
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                {isNext ? (
                  <div className="flex flex-col items-center animate-pulse">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <span className="text-[8px] font-black text-brand uppercase tracking-widest">Live</span>
                    </div>
                    <span className="text-[7px] font-bold text-white/40 uppercase tracking-tighter">
                      {labels[i]}
                    </span>
                  </div>
                ) : (
                  <span className="text-[9px] font-black text-white/10 italic">
                    {i + 1}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default QuadSequentialOverlay;

