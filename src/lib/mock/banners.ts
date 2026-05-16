import type { Banner } from '@/lib/api/types';

export const MOCK_BANNERS: Banner[] = [
  {
    id: 'b1',
    imageUrl:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=2400&q=80',
    mobileImageUrl:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    linkUrl: '/colecao/oasis',
    alt: 'Coleção Oásis — toque dourado e atemporal',
    order: 1,
  },
  {
    id: 'b2',
    imageUrl:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=2400&q=80',
    mobileImageUrl:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80',
    linkUrl: '/colecao/celeste',
    alt: 'Coleção Celeste — inspirada no céu noturno',
    order: 2,
  },
];
