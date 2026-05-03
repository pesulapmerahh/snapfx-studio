import React from 'react';

interface IntroGuidePageProps {
  onBack: () => void;
  onContinue: () => void;
}

const UPDATE_HISTORY = [
  {
    version: 'v0.9.3 (Mei 2026)',
    changes: [
      'Peningkatan tampilan landing agar lebih bersih dan nyaman di mobile.',
      'Quad sequential lebih jelas dengan indikator panel aktif.',
      'Penyempurnaan kualitas rendering untuk efek yang sering dipakai.',
    ],
  },
  {
    version: 'v0.9.2',
    changes: [
      'Penambahan koleksi efek artistik seperti Neon, Ink, Pop Art, dan CRT.',
      'Optimasi performa carousel agar pemilihan filter lebih responsif.',
    ],
  },
  {
    version: 'v0.9.1',
    changes: [
      'Peningkatan stabilitas akses kamera di browser modern.',
      'Alur simpan foto lokal dibuat lebih konsisten dan cepat.',
    ],
  },
];

const HOW_TO_USE = [
  'Izinkan akses kamera saat popup browser muncul.',
  'Geser daftar filter di bagian bawah, lalu pilih efek yang kamu suka.',
  'Tekan tombol shutter untuk mengambil foto (opsional countdown bisa diatur).',
  'Buka thumbnail galeri untuk lihat hasil, lalu simpan sesuai kebutuhan.',
  'Aktifkan Quad Mode jika ingin kolase 2x2 dengan gaya photobooth.',
];

const KEY_FEATURES = [
  {
    title: 'Realtime Filter Engine',
    description: 'Preview efek langsung sebelum jepret, jadi hasil lebih terprediksi.',
  },
  {
    title: 'Mode Quad & Kreatif',
    description: 'Ambil beberapa panel berurutan untuk menghasilkan kolase yang unik.',
  },
  {
    title: 'Privasi Lokal',
    description: 'Foto diproses di perangkatmu. Tidak ada upload otomatis ke server.',
  },
];

const IntroGuidePage: React.FC<IntroGuidePageProps> = ({ onBack, onContinue }) => {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-[90px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">SnapFX Studio Guide</p>
            <h1 className="font-fredoka text-3xl font-bold leading-tight sm:text-4xl">
              Sebelum mulai, ini yang perlu kamu tahu
            </h1>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
          >
            Kembali
          </button>
        </header>

        <main className="grid gap-5 lg:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl lg:col-span-1">
            <h2 className="font-fredoka mb-3 text-xl font-semibold">Histori Update</h2>
            <div className="space-y-4">
              {UPDATE_HISTORY.map((item) => (
                <article key={item.version} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <h3 className="mb-2 text-sm font-bold text-brand">{item.version}</h3>
                  <ul className="space-y-1.5 text-sm leading-relaxed text-zinc-300">
                    {item.changes.map((change) => (
                      <li key={change}>• {change}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl lg:col-span-1">
            <h2 className="font-fredoka mb-3 text-xl font-semibold">Cara Penggunaan</h2>
            <ol className="space-y-3">
              {HOW_TO_USE.map((step, idx) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-zinc-300">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl lg:col-span-1">
            <h2 className="font-fredoka mb-3 text-xl font-semibold">Fitur Utama</h2>
            <div className="space-y-3">
              {KEY_FEATURES.map((feature) => (
                <article key={feature.title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <h3 className="mb-1 text-sm font-bold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-300">{feature.description}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">Tip: bookmark halaman ini agar mudah dibaca ulang oleh user baru.</p>
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center rounded-2xl bg-brand px-7 py-3 text-base font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-hover"
          >
            Lanjut ke SnapFX Studio
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroGuidePage;
