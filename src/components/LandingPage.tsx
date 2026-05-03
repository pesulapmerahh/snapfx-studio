import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

/** Fixed layout — avoids random jumping on React re-renders */
const FLOATING_ICONS = [
  { emoji: '📸', top: '10%', left: '6%', delay: '0s', duration: '4.5s' },
  { emoji: '✨', top: '22%', left: '88%', delay: '0.3s', duration: '3.8s' },
  { emoji: '🌈', top: '78%', left: '10%', delay: '0.1s', duration: '5.2s' },
  { emoji: '🌀', top: '65%', left: '84%', delay: '0.5s', duration: '4.1s' },
  { emoji: '🎞️', top: '42%', left: '4%', delay: '0.2s', duration: '4.9s' },
  { emoji: '💠', top: '8%', left: '72%', delay: '0.4s', duration: '3.6s' },
] as const;

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="landing-scroll relative min-h-[100dvh] bg-zinc-950 text-white overflow-x-hidden overflow-y-auto">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 rounded-full bg-brand/25 blur-[100px] landing-aurora" />
        <div className="absolute top-[38%] -left-[12%] h-[52vmin] w-[52vmin] rounded-full bg-fuchsia-500/15 blur-[90px] landing-aurora-delayed" />
        <div className="absolute -bottom-[8%] right-[-10%] h-[48vmin] w-[48vmin] rounded-full bg-cyan-400/12 blur-[80px] landing-aurora" />
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 landing-dot-grid" />

      {FLOATING_ICONS.map((item, i) => (
        <div
          key={i}
          className="pointer-events-none absolute z-[1] hidden text-3xl opacity-[0.16] sm:block sm:text-4xl landing-float"
          style={{
            top: item.top,
            left: item.left,
            animationDuration: item.duration,
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-4 pt-8 pb-10 sm:px-8 sm:pt-10 sm:pb-14 lg:px-12">
        <header className="mb-10 flex shrink-0 items-center justify-between sm:mb-16">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2.5 pr-6 pl-2 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 text-brand shadow-inner shadow-brand/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span className="font-fredoka text-xl font-bold tracking-tight">
              Snap<span className="text-brand">FX</span>
            </span>
          </div>
          <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 sm:flex">
            <span className="h-1 w-1 rounded-full bg-green-400 shadow-[0_0_12px_theme(colors.green.400)]" />
            realtime
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <section className="flex-1 pb-3 sm:pb-6 lg:pb-0">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-300 backdrop-blur-sm">
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300">Beta</span>
              kamera efek langsung di browser
            </p>

            <h1 className="font-fredoka mb-5 max-w-xl text-[clamp(2.2rem,9vw,4.75rem)] font-bold leading-[0.95] tracking-tight drop-shadow-xl">
              Kreativitas realtime
              <br />
              <span className="bg-gradient-to-r from-white via-brand to-orange-300 bg-clip-text text-transparent">
                tanpa install
              </span>
            </h1>

            <p className="mb-8 max-w-lg font-inter text-base leading-relaxed text-zinc-400 sm:mb-10 sm:text-lg">
              Rasakan{' '}
              <span className="font-semibold text-zinc-200">20+ filter WebGL</span> —
              distort, mood, noir, prism, CRT, neon yang sudah lebih halus, lalu dokumentasikan satu ketukan dari kameramu —{' '}
              <span className="text-zinc-300">semua privat di perangkatmu.</span>
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onStart}
                className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand px-7 py-4 text-base font-bold text-white shadow-xl shadow-brand/35 transition hover:bg-brand-hover hover:shadow-brand/45 active:scale-[0.98] sm:w-auto sm:px-10 sm:py-5 sm:text-lg"
              >
                <span>Buka SnapFX Studio</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition group-hover:translate-x-full duration-700" />
              </button>
              <p className="text-center text-[13px] text-zinc-500 sm:text-left">
                Tidak ada akun • tidak ada upload otomatis
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-300">
                <p className="font-fredoka text-lg text-white">20+</p>
                <p>Filter realtime siap pakai</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-300">
                <p className="font-fredoka text-lg text-white">4x</p>
                <p>Mode kolase Quad sequential</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-300">
                <p className="font-fredoka text-lg text-white">100%</p>
                <p>Proses lokal di perangkatmu</p>
              </div>
            </div>
          </section>

          <aside className="w-full shrink-0 lg:w-[380px] lg:max-w-[42%]">
            <div className="rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-zinc-900/90 to-black/85 p-1 shadow-[0_28px_80px_-40px_rgba(255,77,77,0.45)] backdrop-blur-xl">
              <div className="rounded-[1.82rem] border border-white/5 bg-black/55 p-5 sm:p-8">
                <h2 className="font-fredoka mb-6 text-xl font-semibold tracking-tight">Yang kamu dapatkan</h2>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-xl">⚡</div>
                    <div>
                      <h3 className="mb-1 text-sm font-bold text-white">60 FPS Shader</h3>
                      <p className="text-sm leading-snug text-zinc-400">Motor WebGL langsung untuk pratinjau mulus sebelum foto.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-xl">📚</div>
                    <div>
                      <h3 className="mb-1 text-sm font-bold text-white">Lebih banyak koleksi efek</h3>
                      <p className="text-sm leading-snug text-zinc-400">Basic, geometri, distorsi, mood, dan pewarnaan — bisa dikreasikan lagi dengan Quad Mode.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-xl">🔐</div>
                    <div>
                      <h3 className="mb-1 text-sm font-bold text-white">Privacy first</h3>
                      <p className="text-sm leading-snug text-zinc-400">
                        Rekaman langsung ditangkap di kamu dan disimpan sebagai gambar JPG di galeri lokal aplikasi ini.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    'Neon Night',
                    'Pop Art',
                    'Prism',
                    'Golden',
                    'CRT TV',
                    'Film Noir',
                    'Ink',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </main>

        <footer className="mt-10 shrink-0 border-t border-white/5 pt-6 text-center text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-600 sm:mt-auto sm:pt-8 sm:text-[11px] sm:tracking-[0.35em]">
          Designed for creators • tidak ada pelacakan
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
