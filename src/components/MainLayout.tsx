import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Photo } from '../context/AppContext';
import CameraPreview from './CameraPreview';
import type { CameraPreviewRef } from './CameraPreview';
import type { EffectType } from './EffectEngine';
import EffectCarousel from './EffectCarousel';
import ShutterButton from './ShutterButton';
import GalleryStrip from './GalleryStrip';
import Lightbox from './Lightbox';
import SettingsMenu from './SettingsMenu';
import FeatureNotification from './FeatureNotification';
import QuadSequentialOverlay from './QuadSequentialOverlay';
import { composeQuadPhotos } from '../utils/composeQuad';

const EFFECT_LABELS: Record<EffectType, string> = {
  none: 'Normal',
  grayscale: 'B&W',
  sepia: 'Vintage',
  invert: 'X-Ray',
  noir: 'Film Noir',
  mirror_lr: 'Mirror L-R',
  mirror_tb: 'Mirror T-B',
  kaleidoscope: 'Kaleido',
  pixel: '8-Bit',
  bulge: 'Bulge',
  swirl: 'Swirl',
  glitch: 'Glitch',
  blur: 'Dreamy',
  prism: 'Prism',
  vignette: 'Drama',
  duotone: 'Wave',
  sunset: 'Golden',
  emboss: 'Steel',
  scanlines: 'CRT TV',
  thermal: 'Thermal',
  popart: 'Pop Art',
  comic: 'Ink',
  comic_strip: 'Comic Strip',
  neon: 'Neon Night',
  midnight: 'Midnight',
  infrared: 'IR Glow',
  litho: 'Lithograph',
  vhs: 'VHS Tape',
  acid: 'Acid Pop',
};

const MainLayout: React.FC = () => {
  const { isFlashing, triggerFlash, addPhoto, activeEffect, settings } = useAppContext();
  const activeEffectRef = useRef(activeEffect);
  activeEffectRef.current = activeEffect;

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const cameraRef = useRef<CameraPreviewRef>(null);
  const [quadStep, setQuadStep] = useState(0);
  const quadStagingRef = useRef<(string | null)[]>([null, null, null, null]);
  const quadBusyRef = useRef(false);

  type QuadPanels = [string | null, string | null, string | null, string | null];
  const blankQuadPanels = (): QuadPanels => [null, null, null, null];

  const [frozenPanels, setFrozenPanels] = useState<QuadPanels>(blankQuadPanels);
  const [quadMerging, setQuadMerging] = useState(false);

  const resetQuadSequence = useCallback(() => {
    quadBusyRef.current = false;
    quadStagingRef.current = [null, null, null, null];
    setQuadStep(0);
    setFrozenPanels(blankQuadPanels());
    setQuadMerging(false);
  }, []);

  useEffect(() => {
    if (!settings.quadMode) resetQuadSequence();
  }, [settings.quadMode, resetQuadSequence]);

  useEffect(() => {
    if (settings.quadMode && settings.quadCaptureAllAtOnce) resetQuadSequence();
  }, [settings.quadCaptureAllAtOnce, settings.quadMode, resetQuadSequence]);

  const runCapture = useCallback(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    triggerFlash();

    const sequentialQuad = settings.quadMode && !settings.quadCaptureAllAtOnce;

    if (sequentialQuad && quadBusyRef.current) return;

    if (!sequentialQuad) {
      const dataUrl = cam.capture();
      if (dataUrl) addPhoto(dataUrl, activeEffectRef.current);
      return;
    }

    const idx = quadStep;
    const sliceUrl = cam.captureQuadrant(idx);
    if (!sliceUrl) return;

    quadStagingRef.current[idx] = sliceUrl;

    if (idx >= 3) {
      quadBusyRef.current = true;
      setQuadMerging(true);
    }

    setFrozenPanels((prev) =>
      prev.map((slot, i) => (i === idx ? sliceUrl : slot)) as QuadPanels,
    );

    if (idx >= 3) {
      void composeQuadPhotos(
        quadStagingRef.current as [string, string, string, string]
      )
        .then((merged) => {
          if (merged) addPhoto(merged, activeEffectRef.current);
          resetQuadSequence();
        })
        .finally(() => {
          quadBusyRef.current = false;
          setQuadMerging(false);
        });
      return;
    }

    setQuadStep(idx + 1);
  }, [
    settings.quadCaptureAllAtOnce,
    settings.quadMode,
    triggerFlash,
    addPhoto,
    resetQuadSequence,
    quadStep,
  ]);

  const handleCaptureRequest = () => {
    if (!cameraRef.current || countdown !== null) return;
    if (settings.countdownEnabled) {
      setCountdown(3);
    } else {
      runCapture();
    }
  };

  useEffect(() => {
    if (countdown === null) return undefined;
    if (countdown === 0) {
      setCountdown(null);
      runCapture();
      return undefined;
    }
    const timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, runCapture]);

  const showQuadSequentialHint =
    settings.quadMode && !settings.quadCaptureAllAtOnce;

  const nextPanelNum = frozenPanels.filter((u) => u !== null).length + 1;

  return (
    <div className="relative h-[100dvh] w-full bg-black overflow-hidden flex flex-col font-inter">
      {/* Shutter Flash Animation */}
      {isFlashing && (
        <div className="fixed inset-0 z-[100] bg-white animate-flash pointer-events-none" />
      )}

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none">
          <span className="text-[12rem] font-fredoka font-bold text-white animate-ping drop-shadow-2xl">
            {countdown}
          </span>
        </div>
      )}

      {/* Feature Notification */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-[90vw] pointer-events-none">
        <FeatureNotification />
      </div>

      {/* Main Camera Area */}
      <div className="relative flex-1 min-h-0 bg-zinc-900/50">
        <div className={`w-full h-full flex items-center justify-center transition-all duration-500 ${
          settings.squareCrop ? 'p-4 md:p-12' : ''
        }`}>
          <div className={`relative bg-black shadow-2xl transition-all duration-500 ${
            settings.squareCrop ? 'aspect-square h-full' : 'w-full h-full'
          }`}>
            <CameraPreview 
              ref={cameraRef} 
              frozenPanels={frozenPanels}
              activeQuadrant={settings.quadMode && !settings.quadCaptureAllAtOnce ? quadStep : -1}
            />

            {showQuadSequentialHint && (
              <QuadSequentialOverlay panels={frozenPanels} />
            )}

            {showQuadSequentialHint && (
              <div className="pointer-events-none absolute top-44 sm:top-36 left-1/2 z-[50] w-fit -translate-x-1/2 rounded-full border border-white/10 bg-brand/90 px-4 py-1.5 text-center shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
                {quadMerging ? (
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                    <span className="opacity-70">Jepret: </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full">{Math.min(nextPanelNum, 4)}</span>
                    <span className="opacity-30">/</span>
                    <span className="opacity-50">4</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Top Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-3 md:p-6 flex items-center justify-between pointer-events-none z-50">
          <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
            <div className="bg-brand px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl shadow-lg shadow-brand/20">
              <h1 className="text-sm md:text-2xl font-fredoka font-bold text-white tracking-tight">
                SnapFX
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3 pointer-events-auto">
            <div className="hidden sm:block px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-mono text-zinc-300 uppercase tracking-widest shadow-xl">
              {EFFECT_LABELS[activeEffect]}
            </div>
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Buka Pengaturan"
              className={`p-2 md:p-3 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 text-white transition-all hover:bg-zinc-800 shadow-xl ${
                isSettingsOpen ? 'rotate-90 bg-brand/80 border-brand/50' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        {isSettingsOpen && <SettingsMenu onClose={() => setIsSettingsOpen(false)} />}
      </div>

      {/* Bottom Control UI (Glassmorphism) */}
      <div className="relative z-40 bg-zinc-950/80 backdrop-blur-2xl border-t border-white/5 px-4 pt-4 pb-10 flex flex-col items-center">
        {/* Effect Selection */}
        <EffectCarousel />

        {/* Action Row: Gallery - Shutter - Tools */}
        <div className="w-full max-w-lg mt-6 flex items-center justify-between gap-4">
          <div className="flex-1 flex justify-start">
            <GalleryStrip onSelectPhoto={setSelectedPhoto} />
          </div>
          
          <div className="shrink-0">
            <ShutterButton onCapture={handleCaptureRequest} disabled={countdown !== null} />
          </div>
          
          <div className="flex-1 flex justify-end">
            <button 
              aria-label="Alat Kamera"
              className="p-3.5 bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors rounded-2xl text-zinc-400 border border-white/5 shadow-xl active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M3 9h3l2-3h8l2 3h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      <Lightbox 
        photo={selectedPhoto} 
        onClose={() => setSelectedPhoto(null)} 
      />
    </div>
  );
};

export default MainLayout;
