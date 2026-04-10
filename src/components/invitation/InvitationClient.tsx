'use client';

import { useState } from 'react';
import InvitationSplash from './InvitationSplash';
import MusicPlayer from './MusicPlayer';
import type { MusicConfig } from '@/types/card';

interface Props {
  partner1: string;
  partner2: string;
  music?: MusicConfig;
}

export default function InvitationClient({ partner1, partner2, music }: Props) {
  // Show splash if there's music with autoPlay, otherwise skip it
  const needsSplash = !!(music?.url && (music.autoPlay ?? true));
  const [splashDone, setSplashDone] = useState(!needsSplash);

  return (
    <>
      {/* Splash screen — blocks content until user taps */}
      {!splashDone && (
        <InvitationSplash
          partner1={partner1}
          partner2={partner2}
          onEnter={() => setSplashDone(true)}
        />
      )}

      {/* Music player — autoStart once splash is dismissed */}
      {music?.url && <MusicPlayer music={music} autoStart={splashDone} />}
    </>
  );
}
