import type { Collection } from '@/lib/api/types';

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-serene',
    slug: 'serene',
    name: 'Serene',
    description: 'Linhas etéreas e minimalistas. Joias para o dia a dia, com leveza atemporal.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1600&q=80',
    order: 1,
  },
  {
    id: 'col-celeste',
    slug: 'celeste',
    name: 'Celeste',
    description: 'Inspirada no céu noturno — peças com cintilância sutil e contorno preciso.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80',
    order: 2,
  },
  {
    id: 'col-oasis',
    slug: 'oasis',
    name: 'Oásis',
    description: 'Toque dourado e atemporal. Peças marcantes, perfeitas para presentear.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80',
    order: 3,
  },
];
