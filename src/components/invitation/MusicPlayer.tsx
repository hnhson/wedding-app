'use client';

import { useEffect, useRef, useState } from 'react';
import type { MusicConfig } from '@/types/card';

export default function MusicPlayer({
  music,
  autoStart = false,
}: {
  music: MusicConfig;
  autoStart?: boolean; // true = start playing as soon as component mounts (after user gesture)
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = music.loop ?? true;

    audio.addEventListener('play', () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('ended', () => {
      if (!(music.loop ?? true)) setPlaying(false);
    });
  }, [music.loop]);

  // Start playing when autoStart flips to true (triggered after splash click)
  useEffect(() => {
    if (!autoStart) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {});
  }, [autoStart]);

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
          <span className="flex gap-1">
            <span className="h-5 w-1.5 rounded-full bg-pink-500" />
            <span className="h-5 w-1.5 rounded-full bg-pink-500" />
          </span>
        ) : (
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

        {playing && (
          <span
            className="absolute inset-0 rounded-full border-4 border-pink-300 opacity-40"
            style={{ animation: 'spin 3s linear infinite' }}
          />
        )}
      </button>

      {/* Track name */}
      {music.name && (
        <div className="fixed right-20 bottom-7 z-50 max-w-[180px] truncate rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-lg ring-1 ring-gray-100 backdrop-blur-sm">
          🎵 {music.name}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
