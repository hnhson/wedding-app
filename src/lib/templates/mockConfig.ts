import type { CardConfig } from '@/types/card';

export const MOCK_CARD_CONFIG: Omit<
  CardConfig,
  'templateId' | 'colorPalette' | 'fontPair'
> = {
  coupleNames: { partner1: 'Lan Anh', partner2: 'Minh Khoa' },
  weddingDate: '2025-10-18',
  weddingTime: '18:00',
  venue: {
    name: 'Grand Palace Ballroom',
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    mapUrl: 'https://maps.google.com',
    lat: 10.7769,
    lng: 106.7009,
  },
  loveStory:
    'Chúng tôi gặp nhau vào một buổi chiều thu năm 2020, khi những chiếc lá vàng rơi nhẹ trên con phố nhỏ. Từ ánh mắt đầu tiên, chúng tôi đã biết rằng đây là mối duyên của cả cuộc đời.\n\nBa năm bên nhau — cùng đi qua những ngày nắng, những ngày mưa — chúng tôi ngày càng chắc chắn rằng mình đã tìm đúng người.',
  schedule: [
    { time: '09:00', title: 'Lễ gia tiên', description: 'Tại nhà gái, Quận 3' },
    {
      time: '11:00',
      title: 'Rước dâu',
      description: 'Đoàn xe hoa đưa dâu về nhà trai',
    },
    {
      time: '18:00',
      title: 'Tiệc cưới',
      description: 'Grand Palace Ballroom, Quận 1',
    },
    {
      time: '20:00',
      title: 'Tiệc trà & chụp ảnh',
      description: 'Cùng lưu lại kỷ niệm đẹp',
    },
  ],
  families: [
    { side: 'bride', members: ['Ông Nguyễn Văn An', 'Bà Trần Thị Bình'] },
    { side: 'groom', members: ['Ông Phạm Văn Cường', 'Bà Lê Thị Dung'] },
  ],
  heroImage:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=70',
  gallery: [
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=70',
  ],
  overlayElements: [],
  cardHeight: 900,
  music: {
    url: '',
    name: 'A Thousand Years — Christina Perri',
    autoPlay: false,
    loop: true,
  },
};
