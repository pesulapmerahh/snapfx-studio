import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { useCamera } from '../hooks/useCamera';
import ErrorFallback from './ErrorFallback';
import { isWebGLSupported } from '../utils/webglCheck';
import EffectEngine from './EffectEngine';
import type { EffectEngineRef } from './EffectEngine';
import { useAppContext } from '../context/AppContext';

export interface CameraPreviewRef {
  capture: () => string | null;
  captureQuadrant: (slotIndex: number) => string | null;
}

interface CameraPreviewProps {
  frozenPanels?: (string | null)[];
  activeQuadrant?: number;
}

const CameraPreview = forwardRef<CameraPreviewRef, CameraPreviewProps>(
  ({ frozenPanels, activeQuadrant }, ref) => {
    const {
      stream,
      error,
      isLoading,
      toggleFacingMode,
      startCamera
    } = useCamera();

    const { activeEffect, settings } = useAppContext();
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
    const engineRef = useRef<EffectEngineRef>(null);
    const webglSupported = isWebGLSupported();

    const videoRef = (el: HTMLVideoElement | null) => {
      if (el && !videoElement) {
        setVideoElement(el);
      }
    };

    useImperativeHandle(ref, () => ({
      capture: () => engineRef.current?.capture() || null,
      captureQuadrant: (slotIndex: number) =>
        engineRef.current?.captureQuadrant(slotIndex) || null,
    }));

    useEffect(() => {
      if (webglSupported) {
        startCamera();
      }
    }, [startCamera, webglSupported]);

    useEffect(() => {
      if (videoElement && stream) {
        videoElement.srcObject = stream;
      }
    }, [stream, videoElement]);

    if (!webglSupported) {
      return <ErrorFallback type="WebGLNotSupported" />;
    }

    if (error) {
      return <ErrorFallback type={error as any} onRetry={startCamera} />;
    }

    const showSequentialOverlays = 
      settings.quadMode && 
      !settings.quadCaptureAllAtOnce && 
      frozenPanels;

    return (
      <div className="relative w-full h-full bg-zinc-900 overflow-hidden flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute opacity-0 pointer-events-none"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <EffectEngine 
            ref={engineRef}
            videoElement={videoElement} 
            activeEffect={activeEffect} 
            activeQuadrant={activeQuadrant}
          />

          {/* Sequential Quad Overlays (Frozen frames in the main view) */}
          {showSequentialOverlays && (
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
              {frozenPanels.map((src, i) => (
                <div key={i} className="relative w-full h-full overflow-hidden">
                  {src && (
                    <img 
                      src={src} 
                      alt="" 
                      className="w-full h-full object-cover animate-in fade-in duration-300"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Camera Controls Overlay (Side buttons) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-30">
          <button
            onClick={toggleFacingMode}
            className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all active:scale-90 border border-white/10"
            title="Switch Camera"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 21l-4-4 4-4"/>
              <path d="M3 17h18"/>
              <path d="M17 3l4 4-4 4"/>
              <path d="M21 7H3"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }
);


CameraPreview.displayName = 'CameraPreview';

export default CameraPreview;
