import { useEffect, useRef, useMemo, useCallback, useImperativeHandle, forwardRef, useState } from 'react';
import { WebGLRenderer } from '../utils/WebGLRenderer';
import * as Shaders from '../shaders';
import { useAppContext } from '../context/AppContext';

export type EffectType = 
  | 'none' | 'grayscale' | 'sepia' | 'invert' 
  | 'mirror_lr' | 'mirror_tb' | 'kaleidoscope'
  | 'bulge' | 'swirl' | 'glitch' | 'blur'
  | 'thermal' | 'popart' | 'comic' | 'neon' | 'comic_strip'
  | 'vignette' | 'duotone' | 'sunset' | 'noir' | 'emboss' | 'prism' | 'pixel' | 'scanlines'
  | 'midnight' | 'infrared' | 'litho' | 'vhs' | 'acid';

export interface EffectEngineRef {
  capture: () => string | null;
  /** Crop satu panel 2×2 (0=kir atas, 1=kan atas, 2=kiri bawah, 3=kan bawah); mirroring sama seperti snapshot penuh. */
  captureQuadrant: (slotIndex: number) => string | null;
}

interface EffectEngineProps {
  videoElement: HTMLVideoElement | null;
  activeEffect: EffectType;
  params?: Record<string, any>;
  /** Jika di mode sequential quad, tentukan quadrant mana yang sedang live. -1 artinya semua. */
  activeQuadrant?: number;
}

const EffectEngine = forwardRef<EffectEngineRef, EffectEngineProps>(
  ({ videoElement, activeEffect, params = {}, activeQuadrant }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);
  const requestRef = useRef<number | null>(null);
  const [isContextLost, setIsContextLost] = useState(false);
  const { settings } = useAppContext();

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (!canvasRef.current || isContextLost) return null;
      return canvasRef.current.toDataURL('image/jpeg', 0.9);
    },
    captureQuadrant: (slotIndex: number) => {
      if (!canvasRef.current || isContextLost) return null;
      if (slotIndex < 0 || slotIndex > 3) return null;

      const main = canvasRef.current;
      const W = main.width;
      const H = main.height;
      const cw = Math.floor(W / 2);
      const ch = Math.floor(H / 2);
      
      const rects = [
        { sx: 0, sy: 0 }, 
        { sx: cw, sy: 0 }, 
        { sx: 0, sy: ch }, 
        { sx: cw, sy: ch }
      ];
      const r = rects[slotIndex];

      const piece = document.createElement('canvas');
      piece.width = cw;
      piece.height = ch;
      const pctx = piece.getContext('2d');
      if (!pctx) return null;

      pctx.drawImage(main, r.sx, r.sy, cw, ch, 0, 0, cw, ch);
      return piece.toDataURL('image/jpeg', 0.92);
    },
  }), [isContextLost]);

  const initRenderer = useCallback(() => {
    if (!canvasRef.current) return;
    try {
      const newRenderer = new WebGLRenderer(canvasRef.current);
      setRenderer(newRenderer);
      setIsContextLost(false);
    } catch (e) {
      setIsContextLost(true);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setIsContextLost(true);
      setRenderer(null);
    };

    const handleContextRestored = () => {
      initRenderer();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    
    initRenderer();

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [initRenderer]);

  const currentProgram = useMemo(() => {
    if (!renderer || isContextLost) return null;
    
    const shaderMap: Record<string, string> = {
      none: Shaders.BASE_FRAG,
      grayscale: Shaders.GRAYSCALE_FRAG,
      sepia: Shaders.SEPIA_FRAG,
      invert: Shaders.INVERT_FRAG,
      mirror_lr: Shaders.MIRROR_LR_FRAG,
      mirror_tb: Shaders.MIRROR_TB_FRAG,
      kaleidoscope: Shaders.KALEIDOSCOPE_FRAG,
      bulge: Shaders.BULGE_FRAG,
      swirl: Shaders.SWIRL_FRAG,
      glitch: Shaders.GLITCH_FRAG,
      blur: Shaders.BLUR_FRAG,
      thermal: Shaders.THERMAL_FRAG,
      popart: Shaders.POPART_FRAG,
      comic: Shaders.COMIC_FRAG,
      neon: Shaders.NEON_FRAG,
      vignette: Shaders.VIGNETTE_FRAG,
      duotone: Shaders.DUOTONE_FRAG,
      sunset: Shaders.SUNSET_FRAG,
      noir: Shaders.NOIR_FRAG,
      emboss: Shaders.EMBOSS_FRAG,
      prism: Shaders.PRISM_FRAG,
      pixel: Shaders.PIXEL_FRAG,
      scanlines: Shaders.SCANLINES_FRAG,
      comic_strip: Shaders.COMIC_STRIP_FRAG,
      midnight: Shaders.MIDNIGHT_FRAG,
      infrared: Shaders.INFRARED_FRAG,
      litho: Shaders.LITHO_FRAG,
      vhs: Shaders.VHS_FRAG,
      acid: Shaders.ACID_FRAG,
    };

    const code = shaderMap[activeEffect] || Shaders.BASE_FRAG;
    try {
      return renderer.createProgram(code);
    } catch (e) {
      return null;
    }
  }, [activeEffect, isContextLost, renderer]);

  const updateCanvasSize = useCallback(() => {
    if (!canvasRef.current || !videoElement || videoElement.videoWidth === 0) return;
    
    // Kembali ke rasio asli kamera (biasanya 16:9) sesuai permintaan user
    canvasRef.current.width = videoElement.videoWidth;
    canvasRef.current.height = videoElement.videoHeight;
    
    if (renderer) {
      renderer.getGL().viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [videoElement, renderer]);

  // Force update when video is ready
  useEffect(() => {
    if (videoElement && videoElement.videoWidth > 0) {
      updateCanvasSize();
    }
  }, [videoElement, settings.quadMode, updateCanvasSize]);

  const render = useCallback(() => {
    if (isContextLost || !renderer || !videoElement || !currentProgram || !canvasRef.current) {
      requestRef.current = requestAnimationFrame(render);
      return;
    }

    if (videoElement.readyState >= 2 && videoElement.videoWidth > 0) {
      const uniforms: Record<string, any> = { ...params };
      uniforms.u_mirror = settings.mirrorEnabled ? 1.0 : 0.0;
      const timeEffects: EffectType[] = ['swirl', 'glitch', 'neon', 'prism', 'scanlines', 'vhs'];
      if (timeEffects.includes(activeEffect)) {
        uniforms.u_time = performance.now() / 1000;
      }

      if (settings.quadMode) {
        const w = Math.floor(canvasRef.current.width / 2);
        const h = Math.floor(canvasRef.current.height / 2);
        
        if (w > 0 && h > 0) {
          const isSequential = activeQuadrant !== undefined && activeQuadrant !== -1;
          
          if (isSequential) {
            // Hanya gambar di quadrant yang aktif
            const rects = [
              { x: 0, y: h }, { x: w, y: h },
              { x: 0, y: 0 }, { x: w, y: 0 }
            ];
            const r = rects[activeQuadrant];
            renderer.render(videoElement, currentProgram, uniforms, { ...r, width: w, height: h, clear: true });
          } else {
            // Gambar di semua quadrant (mode split)
            renderer.render(videoElement, currentProgram, uniforms, { x: 0, y: h, width: w, height: h, clear: true });
            renderer.render(videoElement, currentProgram, uniforms, { x: w, y: h, width: w, height: h, clear: false });
            renderer.render(videoElement, currentProgram, uniforms, { x: 0, y: 0, width: w, height: h, clear: false });
            renderer.render(videoElement, currentProgram, uniforms, { x: w, y: 0, width: w, height: h, clear: false });
          }
        } else {
          renderer.render(videoElement, currentProgram, uniforms, { clear: true });
        }
      } else {
        renderer.render(videoElement, currentProgram, uniforms, { clear: true });
      }
    }

    requestRef.current = requestAnimationFrame(render);
  }, [
    videoElement,
    currentProgram,
    params,
    activeEffect,
    updateCanvasSize,
    isContextLost,
    renderer,
    settings.quadMode,
    settings.mirrorEnabled,
    activeQuadrant,
  ]);

  useEffect(() => {
    if (!videoElement) return;
    const onPlay = () => updateCanvasSize();
    videoElement.addEventListener('playing', onPlay);
    videoElement.addEventListener('loadedmetadata', onPlay);
    return () => {
      videoElement.removeEventListener('playing', onPlay);
      videoElement.removeEventListener('loadedmetadata', onPlay);
    };
  }, [videoElement, updateCanvasSize]);

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(render);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [render]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
      {isContextLost && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/90 text-white p-6 text-center backdrop-blur-md">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
          <h4 className="font-fredoka text-xl mb-2">Mengoptimalkan Grafis</h4>
          <p className="text-sm text-zinc-500">Pratinjau akan muncul kembali sebentar lagi...</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain shadow-2xl"
        style={{ display: videoElement && !isContextLost ? 'block' : 'none' }}
      />
    </div>
  );
});

EffectEngine.displayName = 'EffectEngine';

export default EffectEngine;
