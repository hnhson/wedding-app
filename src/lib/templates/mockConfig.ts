import type { CardConfig } from '@/types/card';

export const MOCK_CARD_CONFIG: Omit<
  CardConfig,
  'templateId' | 'colorPalette' | 'fontPair'
> = {
  coupleNames: { partner1: 'Lan Anh', partner2: 'Minh Khoa' },
  weddingDate: '2025-10-18',
  venue: {
    name: 'Grand Palace Ballroom',
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    mapUrl: 'https://maps.google.com',
    lat: 10.7769,
    lng: 106.7009,
  },
  loveStory:
    'Chúng tôi gặp nhau vào một buổi chiều thu năm 2020, khi những chiếc lá vàng rơi nhẹ trên con phố nhỏ. Từ ánh mắt đầu tiên, chúng tôi đã biết rằng đây là mối duyên của cả cuộc đời.',
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
  heroImage: null,
  gallery: [],
  overlayElements: [],
  cardHeight: 900,
};
