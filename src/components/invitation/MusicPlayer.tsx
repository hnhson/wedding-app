'use client';

import { useEffect, useRef, useState } from 'react';
import type { MusicConfig } from '@/types/card';

export default function MusicPlayer({ music }: { music: MusicConfig }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  // Try autoplay on first user interaction if autoPlay is enabled
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = music.loop ?? true;

    const onCanPlay = () => setReady(true);
    audio.addEventListener('canplaythrough', onCanPlay);

    if (music.autoPlay ?? true) {
      // Attempt silent autoplay; browsers usually block it — we catch and wait
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Autoplay blocked: wait for first user gesture then start
          const startOnInteraction = () => {
            audio
              .play()
              .then(() => setPlaying(true))
              .catch(() => {});
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
          };
          document.addEventListener('click', startOnInteraction, {
            once: true,
          });
          document.addEventListener('touchstart', startOnInteraction, {
            once: true,
          });
        });
    }

    audio.addEventListener('play', () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('ended', () => {
      if (!music.loop) setPlaying(false);
    });

    return () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
    };
  }, [music.autoPlay, music.loop]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }

  return (
    <>
      <audio ref={audioRef} src={music.url} preload="auto" />

      {/* Floating button */}
      <button
        onClick={toggle}
        title={playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
        className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl ring-2 ring-pink-200 transition-all hover:scale-105 hover:ring-pink-400 active:scale-95"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        {playing ? (
          /* Pause icon — two bars */
          <span className="flex gap-1">
            <span className="h-5 w-1.5 rounded-full bg-pink-500" />
            <span className="h-5 w-1.5 rounded-full bg-pink-500" />
          </span>
        ) : (
          /* Play icon — triangle */
          <span
            style={{
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
              borderLeft: '16px solid #ec4899',
              marginLeft: 3,
              display: 'inline-block',
            }}
          />
        )}

        {/* Spinning vinyl disc behind button when playing */}
        {playing && (
          <span
            className="absolute inset-0 rounded-full border-4 border-pink-300 opacity-40"
            style={{ animation: 'spin 3s linear infinite' }}
          />
        )}
      </button>

      {/* Track name tooltip */}
      {music.name && (
        <div className="fixed right-20 bottom-7 z-50 max-w-[180px] truncate rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-lg ring-1 ring-gray-100 backdrop-blur-sm">
          🎵 {music.name}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
