import type { ColorPalette, FontPair } from '@/types/card'

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  'rose-gold': { primary: '#B76E79', secondary: '#F7E7E9', accent: '#D4AF37', bg: '#FFF9F9' },
  'sage-white': { primary: '#7C9A7E', secondary: '#F5F7F5', accent: '#C9A96E', bg: '#FAFAFA' },
  'midnight-blue': { primary: '#1B3A4B', secondary: '#E8EFF5', accent: '#C9A96E', bg: '#F8FAFC' },
  'ivory-gold': { primary: '#8B7355', secondary: '#FAF8F0', accent: '#D4AF37', bg: '#FFFDF5' },
  'blush-pink': { primary: '#D4A0A7', secondary: '#FFF0F2', accent: '#B5838D', bg: '#FFFAFA' },
  'forest-green': { primary: '#2D5016', secondary: '#F0F5EB', accent: '#8B7355', bg: '#F8FAF5' },
  'dusty-rose': { primary: '#C08B8B', secondary: '#FDF0F0', accent: '#8B6A6A', bg: '#FFFAFA' },
  'navy-silver': { primary: '#1C2B4A', secondary: '#F0F2F5', accent: '#A8B2C3', bg: '#F5F7FA' },
  'terracotta': { primary: '#C1666B', secondary: '#FDF3F1', accent: '#8B5E52', bg: '#FDFAF9' },
  'lavender': { primary: '#7B6FA0', secondary: '#F3F0F8', accent: '#C9A96E', bg: '#FAF9FC' },
  'emerald': { primary: '#2E7D5E', secondary: '#F0F7F4', accent: '#D4AF37', bg: '#F8FCF9' },
  'charcoal': { primary: '#3A3A3A', secondary: '#F5F5F5', accent: '#C9A96E', bg: '#FAFAFA' },
}

export const FONT_PAIRS: Record<string, FontPair> = {
  'playfair-lato': { heading: 'Playfair Display', body: 'Lato' },
  'cormorant-jost': { heading: 'Cormorant Garamond', body: 'Jost' },
  'libre-nunito': { heading: 'Libre Baskerville', body: 'Nunito' },
  'cinzel-raleway': { heading: 'Cinzel', body: 'Raleway' },
  'great-vibes-montserrat': { heading: 'Great Vibes', body: 'Montserrat' },
  'sacramento-poppins': { heading: 'Sacramento', body: 'Poppins' },
  'tangerine-roboto': { heading: 'Tangerine', body: 'Roboto' },
  'allura-source': { heading: 'Allura', body: 'Source Sans 3' },
  'alex-josefin': { heading: 'Alex Brush', body: 'Josefin Sans' },
  'gfs-open': { heading: 'GFS Didot', body: 'Open Sans' },
}

export const DEFAULT_PALETTE = COLOR_PALETTES['rose-gold']
export const DEFAULT_FONT_PAIR = FONT_PAIRS['playfair-lato']
