import type { Template, CardConfig } from '@/types/card';
import { COLOR_PALETTES, FONT_PAIRS } from './presets';

export const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Truyền thống, trang nhã',
    layout: 'classic',
    thumbnail: { bg: '#FFF9F9', accent: '#B76E79', style: 'classic' },
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Hiện đại, tinh tế',
    layout: 'modern',
    thumbnail: { bg: '#F8FAFC', accent: '#1B3A4B', style: 'modern' },
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Tối giản, thanh lịch',
    layout: 'minimal',
    thumbnail: { bg: '#FAFAFA', accent: '#3A3A3A', style: 'minimal' },
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'floral',
    name: 'Floral',
    description: 'Hoa lá, lãng mạn',
    layout: 'floral',
    thumbnail: { bg: '#FFF9F9', accent: '#B76E79', style: 'floral' },
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sang trọng, cổ điển',
    layout: 'elegant',
    thumbnail: { bg: '#FFFDF5', accent: '#D4AF37', style: 'elegant' },
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'romance',
    name: 'Romance',
    description: 'Ngọt ngào, tình cảm',
    layout: 'romance',
    thumbnail: { bg: '#FFF0F2', accent: '#D4A0A7', style: 'romance' },
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'garden',
    name: 'Garden',
    description: 'Thiên nhiên, tươi mát',
    layout: 'garden',
    thumbnail: { bg: '#F0F7F4', accent: '#2E7D5E', style: 'garden' },
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'luxe',
    name: 'Luxe',
    description: 'Xa xỉ, đẳng cấp',
    layout: 'luxe',
    thumbnail: { bg: '#1a1714', accent: '#D4AF37', style: 'luxe' },
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Hoài cổ, ấm áp',
    layout: 'vintage',
    thumbnail: { bg: '#FAF3E0', accent: '#8B7355', style: 'vintage' },
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'celestial',
    name: 'Celestial',
    description: 'Huyền bí, lãng mạn',
    layout: 'celestial',
    thumbnail: { bg: '#0f1628', accent: '#D4AF37', style: 'celestial' },
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
