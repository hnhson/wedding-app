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
  type: 'image';
  url: string;
  x: number; // px, in card space (card width = 480px)
  y: number; // px, from top
  width: number; // px
  height: number; // px
}

export interface CardConfig {
  templateId: string;
  coupleNames: { partner1: string; partner2: string };
  weddingDate: string;
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
}

export interface Template {
  id: string;
  name: string;
  layout: 'classic' | 'modern' | 'minimal' | 'floral';
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
