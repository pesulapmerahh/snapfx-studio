import { useState, useEffect, useCallback, useRef } from 'react';

export type CameraError = 'PermissionDenied' | 'NotFound' | 'NotSupported' | 'Unknown';

interface UseCameraReturn {
  stream: MediaStream | null;
  error: CameraError | null;
  isLoading: boolean;
  isMirrored: boolean;
  facingMode: 'user' | 'environment';
  toggleFacingMode: () => void;
  toggleMirror: () => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export const useCamera = (): UseCameraReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<CameraError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isMirrored, setIsMirrored] = useState(true);
  
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('NotSupported');
      setIsLoading(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = newStream;
      setStream(newStream);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('PermissionDenied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('NotFound');
      } else {
        setError('Unknown');
      }
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, stopCamera]);

  const toggleFacingMode = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const toggleMirror = useCallback(() => {
    setIsMirrored(prev => !prev);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    stream,
    error,
    isLoading,
    isMirrored,
    facingMode,
    toggleFacingMode,
    toggleMirror,
    startCamera,
    stopCamera
  };
};
