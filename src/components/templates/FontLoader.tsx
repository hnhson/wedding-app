'use client';

import { useEffect } from 'react';

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?' +
  [
    // Serif heading fonts
    'family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600',
    'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600',
    'family=Libre+Baskerville:ital,wght@0,400;0,700;1,400',
    'family=Cinzel:wght@400;600;700',
    'family=GFS+Didot',
    'family=Noto+Serif:ital,wght@0,400;0,700;1,400',
    // Script / decorative heading fonts
    'family=Great+Vibes',
    'family=Sacramento',
    'family=Alex+Brush',
    'family=Allura',
    'family=Dancing+Script:wght@400;700',
    'family=Pinyon+Script',
    'family=Tangerine:wght@400;700',
    // Body fonts — all with Vietnamese support
    'family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400',
    'family=Lato:ital,wght@0,300;0,400;0,700;1,400',
    'family=Jost:wght@300;400;500;600',
    'family=Raleway:wght@300;400;500;600',
    'family=Nunito:wght@300;400;600',
    'family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400',
    'family=Poppins:ital,wght@0,300;0,400;0,500;0,600;1,400',
    'family=Josefin+Sans:ital,wght@0,300;0,400;0,600;1,300',
    'family=Source+Sans+3:ital,wght@0,300;0,400;0,600;1,400',
    'family=Open+Sans:ital,wght@0,300;0,400;0,600;1,400',
    'family=Mulish:ital,wght@0,300;0,400;0,600;1,400',
  ].join('&') +
  '&subset=latin,vietnamese&display=swap';

export default function FontLoader() {
  useEffect(() => {
    const id = 'wedding-google-fonts';
    if (document.getElementById(id)) return;

    // Preconnect
    for (const href of [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]) {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const pre = document.createElement('link');
        pre.rel = 'preconnect';
        if (href.includes('gstatic')) pre.crossOrigin = 'anonymous';
        pre.href = href;
        document.head.appendChild(pre);
      }
    }

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);

  return null;
}
