import type { OrderStatus, PromoStatus, Tier } from '@/components/admin/ui';

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  payment: string;
  shipping: string;
}

export const ADMIN_ORDERS: AdminOrder[] = [
  { id: 'MAB-04812', customer: 'Helena Vasconcellos', email: 'helena@email.com.br', date: '15 mai · 14:32', items: 2, total: 48890, status: 'pago', payment: 'Cartão · 6x', shipping: 'SEDEX' },
  { id: 'MAB-04811', customer: 'Camila Santos', email: 'camila.s@email.com', date: '15 mai · 13:51', items: 1, total: 21900, status: 'aguardando', payment: 'PIX', shipping: 'PAC' },
  { id: 'MAB-04810', customer: 'Renata Pereira', email: 'renata.p@email.com', date: '15 mai · 12:18', items: 4, total: 72950, status: 'preparando', payment: 'Cartão · 6x', shipping: 'SEDEX' },
  { id: 'MAB-04809', customer: 'Aline Moraes', email: 'aline.m@email.com', date: '15 mai · 10:04', items: 1, total: 16900, status: 'enviado', payment: 'PIX', shipping: 'PAC' },
  { id: 'MAB-04808', customer: 'Beatriz Ferreira', email: 'beatriz@email.com', date: '15 mai · 09:22', items: 1, total: 34900, status: 'pago', payment: 'Cartão · 4x', shipping: 'SEDEX' },
  { id: 'MAB-04807', customer: 'Mariana Lopes', email: 'mlopes@email.com', date: '14 mai · 22:41', items: 3, total: 95700, status: 'entregue', payment: 'Cartão · 8x', shipping: 'Expressa' },
  { id: 'MAB-04806', customer: 'Júlia Andrade', email: 'julia.a@email.com', date: '14 mai · 19:08', items: 2, total: 45800, status: 'enviado', payment: 'PIX', shipping: 'SEDEX' },
  { id: 'MAB-04805', customer: 'Patricia Salles', email: 'patsalles@email.com', date: '14 mai · 16:52', items: 1, total: 28900, status: 'preparando', payment: 'Cartão · 6x', shipping: 'PAC' },
  { id: 'MAB-04804', customer: 'Lara Toledo', email: 'lara.t@email.com', date: '14 mai · 14:21', items: 5, total: 128900, status: 'pago', payment: 'Cartão · 10x', shipping: 'SEDEX' },
  { id: 'MAB-04803', customer: 'Sofia Reis', email: 'sofia.r@email.com', date: '14 mai · 11:09', items: 1, total: 19900, status: 'cancelado', payment: 'PIX', shipping: '—' },
  { id: 'MAB-04802', customer: 'Isabela Cunha', email: 'isac@email.com', date: '13 mai · 22:14', items: 2, total: 53800, status: 'entregue', payment: 'PIX', shipping: 'SEDEX' },
  { id: 'MAB-04801', customer: 'Tatiana Brito', email: 'tati.b@email.com', date: '13 mai · 17:32', items: 1, total: 25900, status: 'entregue', payment: 'Cartão · 4x', shipping: 'PAC' },
];

export interface AdminCustomer {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  tier: Tier;
  orders: number;
  ltv: number;
  lastOrderAt: string;
}

export const ADMIN_CUSTOMERS: AdminCustomer[] = [
  { id: 'cli-001', name: 'Helena Vasconcellos', initials: 'HV', email: 'helena@email.com.br', phone: '(11) 99821-4471', city: 'São Paulo', state: 'SP', tier: 'Diamond', orders: 12, ltv: 484200, lastOrderAt: '15 mai' },
  { id: 'cli-002', name: 'Camila Santos', initials: 'CS', email: 'camila.s@email.com', phone: '(21) 99812-3344', city: 'Rio de Janeiro', state: 'RJ', tier: 'Insider', orders: 6, ltv: 187800, lastOrderAt: '15 mai' },
  { id: 'cli-003', name: 'Renata Pereira', initials: 'RP', email: 'renata.p@email.com', phone: '(31) 98711-9090', city: 'Belo Horizonte', state: 'MG', tier: 'Diamond', orders: 18, ltv: 612300, lastOrderAt: '15 mai' },
  { id: 'cli-004', name: 'Aline Moraes', initials: 'AM', email: 'aline.m@email.com', phone: '(41) 99411-2233', city: 'Curitiba', state: 'PR', tier: 'Member', orders: 2, ltv: 32800, lastOrderAt: '15 mai' },
  { id: 'cli-005', name: 'Beatriz Ferreira', initials: 'BF', email: 'beatriz@email.com', phone: '(85) 98899-1122', city: 'Fortaleza', state: 'CE', tier: 'Insider', orders: 5, ltv: 167500, lastOrderAt: '15 mai' },
  { id: 'cli-006', name: 'Mariana Lopes', initials: 'ML', email: 'mlopes@email.com', phone: '(11) 98722-3311', city: 'São Paulo', state: 'SP', tier: 'Insider', orders: 4, ltv: 142100, lastOrderAt: '14 mai' },
  { id: 'cli-007', name: 'Júlia Andrade', initials: 'JA', email: 'julia.a@email.com', phone: '(11) 99812-4499', city: 'Campinas', state: 'SP', tier: 'Member', orders: 2, ltv: 67200, lastOrderAt: '14 mai' },
  { id: 'cli-008', name: 'Lara Toledo', initials: 'LT', email: 'lara.t@email.com', phone: '(51) 99844-7711', city: 'Porto Alegre', state: 'RS', tier: 'Diamond', orders: 14, ltv: 528900, lastOrderAt: '14 mai' },
];

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  collection?: string;
  price: number;
  stock: number;
  status: 'ativo' | 'rascunho' | 'arquivado';
  sales30d: number;
}

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 'p-001', sku: 'COL-LUM-OURO', name: 'Colar Lumière', category: 'Colares', collection: 'Oásis', price: 28900, stock: 14, status: 'ativo', sales30d: 42 },
  { id: 'p-002', sku: 'ANE-TRI-OURO', name: 'Anel Trinity', category: 'Anéis', collection: 'Solar', price: 32900, stock: 3, status: 'ativo', sales30d: 36 },
  { id: 'p-003', sku: 'BRI-MIRA-PRATA', name: 'Brinco Mira', category: 'Brincos', collection: 'Celeste', price: 18900, stock: 2, status: 'ativo', sales30d: 31 },
  { id: 'p-004', sku: 'PUL-ESS-OURO', name: 'Pulseira Essência', category: 'Pulseiras', price: 21900, stock: 28, status: 'ativo', sales30d: 24 },
  { id: 'p-005', sku: 'COL-AST-OURO', name: 'Colar Astra', category: 'Colares', collection: 'Celeste', price: 34900, stock: 11, status: 'ativo', sales30d: 18 },
  { id: 'p-006', sku: 'CON-LIRA-OURO', name: 'Conjunto Lira', category: 'Conjuntos', price: 58900, stock: 6, status: 'ativo', sales30d: 12 },
  { id: 'p-007', sku: 'ANE-EST-OURO', name: 'Anel Estrela', category: 'Anéis', collection: 'Celeste', price: 26900, stock: 0, status: 'rascunho', sales30d: 0 },
  { id: 'p-008', sku: 'BRA-VIN-INOX', name: 'Bracelete Vinha', category: 'Braceletes', price: 19900, stock: 21, status: 'ativo', sales30d: 9 },
];

export interface AdminCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
  status: 'publicada' | 'rascunho';
  updatedAt: string;
  coverImageUrl: string;
}

export const ADMIN_COLLECTIONS: AdminCollection[] = [
  { id: 'col-1', slug: 'oasis', name: 'Oásis', description: 'A linha mais quente da estação, em tons dourados.', productCount: 14, status: 'publicada', updatedAt: '12 mai', coverImageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=80' },
  { id: 'col-2', slug: 'celeste', name: 'Celeste', description: 'Inspirada nas estrelas, prata 925 contrastada.', productCount: 10, status: 'publicada', updatedAt: '04 mai', coverImageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=80' },
  { id: 'col-3', slug: 'solar', name: 'Solar', description: 'Linha de aniversário, ouro 18k com pedras.', productCount: 8, status: 'publicada', updatedAt: '28 abr', coverImageUrl: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1000&q=80' },
  { id: 'col-4', slug: 'minimal', name: 'Minimal', description: 'Peças clean para o dia a dia.', productCount: 12, status: 'rascunho', updatedAt: '15 mai', coverImageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80' },
];

export interface AdminPromotion {
  id: string;
  type: 'campaign' | 'coupon' | 'rule';
  name: string;
  code?: string;
  discount: string;
  scope: string;
  uses: number;
  usesMax?: number;
  startsAt: string;
  expiresAt?: string;
  status: PromoStatus;
}

export const ADMIN_PROMOTIONS: AdminPromotion[] = [
  { id: 'pr-1', type: 'campaign', name: 'Dia das Mães', code: 'MAES26', discount: '15% OFF', scope: 'Toda a loja', uses: 142, usesMax: 500, startsAt: '01 mai', expiresAt: '23 mai', status: 'ativo' },
  { id: 'pr-2', type: 'coupon', name: 'Boas-vindas', code: 'BEMVINDA', discount: '10% OFF', scope: 'Primeira compra', uses: 312, startsAt: '01 jan', status: 'ativo' },
  { id: 'pr-3', type: 'coupon', name: 'Frete grátis', code: 'FRETEGRATIS', discount: 'Frete grátis', scope: 'Acima R$ 200', uses: 88, usesMax: 200, startsAt: '10 mai', expiresAt: '17 mai', status: 'ativo' },
  { id: 'pr-4', type: 'campaign', name: 'Black Mabruk', code: 'BLACK', discount: '20% OFF', scope: 'Coleção Solar', uses: 0, startsAt: '24 nov', expiresAt: '30 nov', status: 'agendado' },
  { id: 'pr-5', type: 'coupon', name: 'Carnaval', code: 'CARNA', discount: '12% OFF', scope: 'Toda a loja', uses: 220, startsAt: '08 fev', expiresAt: '16 fev', status: 'expirado' },
];

export interface AdminBanner {
  id: string;
  name: string;
  placement: 'hero' | 'editorial' | 'topbar' | 'category';
  status: 'ativo' | 'agendado' | 'pausado' | 'expirado';
  audience: 'all' | 'new' | 'insider' | 'abandoned-cart';
  startsAt: string;
  endsAt?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  imageUrl: string;
}

export const ADMIN_BANNERS: AdminBanner[] = [
  { id: 'bn-1', name: 'Hero — Coleção Oásis', placement: 'hero', status: 'ativo', audience: 'all', startsAt: '01 mai', endsAt: '31 mai', impressions: 24840, clicks: 1240, ctr: 5.0, imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=80' },
  { id: 'bn-2', name: 'Editorial Mabruk', placement: 'editorial', status: 'ativo', audience: 'all', startsAt: '20 abr', impressions: 18200, clicks: 412, ctr: 2.3, imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=80' },
  { id: 'bn-3', name: 'Topbar — Frete grátis', placement: 'topbar', status: 'ativo', audience: 'all', startsAt: '01 jan', impressions: 84210, clicks: 320, ctr: 0.4, imageUrl: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1000&q=80' },
  { id: 'bn-4', name: 'Hero — Dia das Mães', placement: 'hero', status: 'agendado', audience: 'all', startsAt: '17 mai', endsAt: '23 mai', impressions: 0, clicks: 0, ctr: 0, imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80' },
];

export interface AdminLanding {
  slug: string;
  name: string;
  path: string;
  status: 'publicada' | 'rascunho';
  views: number;
  conversion: number;
}

export const ADMIN_LANDINGS: AdminLanding[] = [
  { slug: 'revendedoras', name: 'Seja uma revendedora', path: '/revendedoras', status: 'publicada', views: 4210, conversion: 3.8 },
  { slug: 'dia-das-maes', name: 'Dia das Mães', path: '/lp/dia-das-maes', status: 'publicada', views: 1840, conversion: 6.1 },
  { slug: 'black-mabruk', name: 'Black Mabruk', path: '/lp/black-mabruk', status: 'rascunho', views: 0, conversion: 0 },
];
