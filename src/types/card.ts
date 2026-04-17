export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
}

export interface FontPair {
  heading: string;
  body: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface FamilyInfo {
  side: 'groom' | 'bride';
  members: string[];
}

export interface OverlayElement {
  id: string;
  type: 'image' | 'rect' | 'text';
  // image only
  url?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  flipH?: boolean;
  flipV?: boolean;
  brightness?: number; // 0–200, default 100
  contrast?: number; // 0–200, default 100
  grayscale?: number; // 0–100, default 0
  sepia?: number; // 0–100, default 0
  blur?: number; // 0–20, default 0
  // rect only
  backgroundColor?: string;
  // text only
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
  // common
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MusicConfig {
  url: string;
  name?: string;
  autoPlay: boolean;
  loop: boolean;
}

export interface CardConfig {
  templateId: string;
  coupleNames: { partner1: string; partner2: string };
  weddingDate: string;
  weddingTime?: string;
  venue: {
    name: string;
    address: string;
    mapUrl: string;
    lat: number;
    lng: number;
  };
  loveStory: string;
  schedule: ScheduleItem[];
  families: FamilyInfo[];
  colorPalette: string;
  fontPair: string;
  heroImage: string | null;
  gallery: string[];
  overlayElements?: OverlayElement[];
  cardHeight?: number; // px, min height of card (default 900)
  music?: MusicConfig;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  layout:
    | 'classic'
    | 'modern'
    | 'minimal'
    | 'floral'
    | 'elegant'
    | 'romance'
    | 'garden'
    | 'luxe'
    | 'vintage'
    | 'celestial';
  thumbnail: { bg: string; accent: string; style: string };
  colorPalettes: Record<string, ColorPalette>;
  fontPairs: Record<string, FontPair>;
}

export interface Card {
  id: string;
  user_id: string;
  slug: string;
  config: CardConfig;
  created_at: string;
  updated_at: string;
}
