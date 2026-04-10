'use client';

import { useState } from 'react';

interface Props {
  partner1: string;
  partner2: string;
  onEnter: () => void;
}

export default function InvitationSplash({
  partner1,
  partner2,
  onEnter,
}: Props) {
  const [leaving, setLeaving] = useState(false);

  function handleEnter() {
    setLeaving(true);
    setTimeout(onEnter, 600); // wait for fade-out animation
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background:
          'linear-gradient(135deg, #fdf6ee 0%, #fce7f3 50%, #f0f4ff 100%)',
      }}
    >
      {/* Decorative petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          'top-10 left-10',
          'top-20 right-16',
          'bottom-24 left-20',
          'bottom-16 right-10',
          'top-1/2 left-6',
        ].map((pos, i) => (
          <span
            key={i}
            className={`absolute text-pink-200 select-none ${pos}`}
            style={{ fontSize: 32 + (i % 3) * 12, opacity: 0.5 }}
          >
            ✿
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-6 px-8 text-center">
        <p className="text-sm tracking-[0.3em] text-pink-400 uppercase">
          Trân trọng kính mời
        </p>

        <h1
          className="text-5xl leading-tight font-light text-gray-800"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {partner1 || 'Cô Dâu'}
          <span className="mx-3 text-pink-300">&</span>
          {partner2 || 'Chú Rể'}
        </h1>

        <div className="h-px w-24 bg-pink-200" />

        <p className="text-sm text-gray-500">Nhấn vào để xem thiệp cưới</p>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          className="group relative mt-2 flex items-center gap-3 rounded-full border border-pink-200 bg-white/80 px-8 py-3.5 text-sm font-medium text-pink-600 shadow-lg backdrop-blur-sm transition-all hover:border-pink-400 hover:bg-pink-50 hover:shadow-xl active:scale-95"
        >
          {/* Music note */}
          <span className="text-base">🎵</span>
          Vào xem thiệp
          {/* Animated ring */}
          <span className="absolute inset-0 rounded-full border border-pink-300 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
