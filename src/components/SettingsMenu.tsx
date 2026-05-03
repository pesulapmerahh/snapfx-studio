import React from 'react';
import { useAppContext } from '../context/AppContext';

interface SettingsMenuProps {
  onClose: () => void;
}

type ToggleKey =
  | 'countdownEnabled'
  | 'mirrorEnabled'
  | 'quadMode'
  | 'squareCrop'
  | 'flashEnabled';

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onClose }) => {
  const { settings, updateSettings } = useAppContext();

  const toggles: { id: ToggleKey; label: string; icon: string }[] = [
    { id: 'countdownEnabled', label: 'Countdown (3s)', icon: '⏱️' },
    { id: 'mirrorEnabled', label: 'Mirror Camera', icon: '🪞' },
    { id: 'quadMode', label: 'Quad Mode (2×2)', icon: '🖼️' },
    { id: 'squareCrop', label: 'Square Crop (1:1)', icon: '⬛' },
    { id: 'flashEnabled', label: 'Screen Flash', icon: '📸' },
  ];

  const quadCaptureBurst = settings.quadCaptureAllAtOnce;

  return (
    <div className="absolute top-20 right-6 z-50 w-72 bg-zinc-900/92 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 max-h-[min(88vh,520px)] overflow-y-auto scrollbar-thin-glass">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Settings</h3>
        <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {toggles.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              updateSettings({ [item.id]: !settings[item.id] })
            }
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
              settings[item.id]
                ? 'bg-brand/10 text-brand border border-brand/20'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0">{item.icon}</span>
              <span className="text-xs font-bold text-left truncate">{item.label}</span>
            </div>
            <div className={`w-9 h-5 rounded-full relative shrink-0 transition-colors ${
              settings[item.id] ? 'bg-brand' : 'bg-zinc-700'
            }`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-[left] ${
                settings[item.id] ? 'left-[1.125rem]' : 'left-0.5'
              }`} />
            </div>
          </button>
        ))}

        {settings.quadMode && (
          <div className="mt-4 rounded-2xl border border-brand/25 bg-brand/5 p-4">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-lg shrink-0" aria-hidden>📷</span>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Cara foto Quad</p>
                <p className="text-[10px] text-zinc-500 mt-1 leading-snug">
                  Jika Quad aktif: rekam langsung satu jepretan besar, atau isi kotak bergiliran (total 4 ketukan menjadi satu foto).
                </p>
              </div>
            </div>
            <div className="flex rounded-xl border border-white/10 bg-black/40 p-0.5 gap-0.5">
              <button
                type="button"
                onClick={() => updateSettings({ quadCaptureAllAtOnce: true })}
                className={`flex-1 px-3 py-2 rounded-[11px] text-[11px] font-bold transition-all leading-tight ${
                  quadCaptureBurst
                    ? 'bg-brand text-white shadow-inner shadow-brand/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Langsung 1 foto
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ quadCaptureAllAtOnce: false })}
                className={`flex-1 px-3 py-2 rounded-[11px] text-[11px] font-bold transition-all leading-tight ${
                  !quadCaptureBurst
                    ? 'bg-brand text-white shadow-inner shadow-brand/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                4× satu per satu
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">SnapFX v1.3.0</p>
      </div>
    </div>
  );
};

export default SettingsMenu;
