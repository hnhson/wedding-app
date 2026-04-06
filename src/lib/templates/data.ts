import type { Template, CardConfig } from '@/types/card';
import { COLOR_PALETTES, FONT_PAIRS } from './presets';

export const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    layout: 'classic',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'modern',
    name: 'Modern',
    layout: 'modern',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    layout: 'minimal',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'floral',
    name: 'Floral',
    layout: 'floral',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'golden',
    name: 'Golden',
    layout: 'classic',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'rustic',
    name: 'Rustic',
    layout: 'minimal',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
];

export const DEFAULT_CARD_CONFIG: CardConfig = {
  templateId: 'classic',
  coupleNames: { partner1: '', partner2: '' },
  weddingDate: '',
  venue: { name: '', address: '', mapUrl: '', lat: 0, lng: 0 },
  loveStory: '',
  schedule: [],
  families: [],
  colorPalette: 'rose-gold',
  fontPair: 'playfair-lato',
  heroImage: null,
  gallery: [],
};

export function getTemplate(templateId: string): Template {
  return TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
}
