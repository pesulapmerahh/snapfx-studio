import React from 'react';

export type ErrorType = 'PermissionDenied' | 'NotFound' | 'WebGLNotSupported' | 'Unknown';

interface ErrorFallbackProps {
  type: ErrorType;
  onRetry?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ type, onRetry }) => {
  const content = {
    PermissionDenied: {
      title: 'Akses Kamera Ditolak',
      message: 'SnapFX memerlukan akses kamera untuk mengambil foto. Silakan berikan izin di pengaturan browser Anda.',
      icon: '🚫'
    },
    NotFound: {
      title: 'Kamera Tidak Ditemukan',
      message: 'Kami tidak dapat menemukan kamera di perangkat Anda. Pastikan kamera terhubung dan tidak digunakan aplikasi lain.',
      icon: '📸'
    },
    WebGLNotSupported: {
      title: 'WebGL Tidak Didukung',
      message: 'Browser Anda tidak mendukung WebGL, yang diperlukan untuk memproses efek real-time. Silakan perbarui browser Anda.',
      icon: '💻'
    },
    Unknown: {
      title: 'Terjadi Kesalahan',
      message: 'Maaf, terjadi kesalahan yang tidak terduga saat mengakses kamera.',
      icon: '⚠️'
    }
  };

  const { title, message, icon } = content[type] || content.Unknown;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 max-w-md mx-auto h-full">
      <div className="text-6xl mb-2">{icon}</div>
      <h2 className="text-2xl font-fredoka font-bold text-white tracking-wide">
        {title}
      </h2>
      <p className="text-zinc-400 font-inter leading-relaxed">
        {message}
      </p>
      {onRetry && type !== 'WebGLNotSupported' && (
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand/20"
        >
          Coba Lagi
        </button>
      )}
      {type === 'WebGLNotSupported' && (
        <a
          href="https://get.webgl.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-full transition-all"
        >
          Pelajari WebGL
        </a>
      )}
    </div>
  );
};

export default ErrorFallback;
