import type { Banho, Product, ProductDetails, ProductImage, ProductVariant } from '@/lib/api/types';

/**
 * Catálogo de 14 produtos baseado em `design_handoff_mabruk_b2c/design-files/catalog.jsx`.
 * Cada produto tem 2-3 variantes (combinações banho × tamanho).
 *
 * Imagens: URLs do Unsplash até termos fotos reais carregadas via API.
 */

interface RawProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  collectionSlugs?: string[];
  tagSlugs?: string[];
  imageUrl: string;
  variantConfigs: Array<{ banho: Banho; size: string; priceCents: number; stock: number }>;
  weightInGrams?: number;
}

const RAW: RawProduct[] = [
  {
    id: 'p01',
    sku: 'MAB-AN-0124',
    slug: 'anel-solitario-olympe',
    name: 'Anel Solitário Olympe',
    description:
      'Solitário delicado com pedra zircônia central, cravação em garras. Acabamento espelhado e haste fina, perfeito para uso diário.',
    categorySlug: 'aneis',
    categoryName: 'Anéis',
    collectionSlugs: ['serene'],
    tagSlugs: ['minimalista', 'com-pedra'],
    imageUrl:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: '14', priceCents: 18900, stock: 6 },
      { banho: 'OURO_18K', size: '16', priceCents: 18900, stock: 8 },
      { banho: 'OURO_18K', size: '18', priceCents: 18900, stock: 4 },
      { banho: 'PRATA_925', size: '14', priceCents: 14900, stock: 5 },
      { banho: 'PRATA_925', size: '16', priceCents: 14900, stock: 7 },
      { banho: 'PRATA_925', size: '18', priceCents: 14900, stock: 3 },
    ],
    weightInGrams: 3,
  },
  {
    id: 'p02',
    sku: 'MAB-AN-0119',
    slug: 'anel-trinity-dourado',
    name: 'Anel Trinity Dourado',
    description:
      'Três aros entrelaçados, símbolo de continuidade. Banho ouro 18k. Peça leve, confortável para usar dia e noite.',
    categorySlug: 'aneis',
    categoryName: 'Anéis',
    collectionSlugs: ['oasis'],
    tagSlugs: ['minimalista'],
    imageUrl:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: '15', priceCents: 21900, stock: 10 },
      { banho: 'OURO_18K', size: '17', priceCents: 21900, stock: 8 },
      { banho: 'OURO_18K', size: '19', priceCents: 21900, stock: 6 },
    ],
    weightInGrams: 4,
  },
  {
    id: 'p03',
    sku: 'MAB-AN-0102',
    slug: 'alianca-florenca',
    name: 'Aliança Florença',
    description:
      'Aliança clássica de aro arredondado, polida. Versão fina para uso solo ou empilhada.',
    categorySlug: 'aneis',
    categoryName: 'Anéis',
    collectionSlugs: ['serene'],
    imageUrl:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: '14', priceCents: 15900, stock: 12 },
      { banho: 'OURO_18K', size: '16', priceCents: 15900, stock: 14 },
      { banho: 'PRATA_925', size: '14', priceCents: 12900, stock: 10 },
      { banho: 'PRATA_925', size: '16', priceCents: 12900, stock: 8 },
    ],
    weightInGrams: 2,
  },
  {
    id: 'p04',
    sku: 'MAB-AN-0131',
    slug: 'anel-estrela-celeste',
    name: 'Anel Estrela Celeste',
    description:
      'Anel com pingente em formato de estrela, cravado com zircônias. Inspirado no céu noturno.',
    categorySlug: 'aneis',
    categoryName: 'Anéis',
    collectionSlugs: ['celeste'],
    tagSlugs: ['com-pedra', 'novidade'],
    imageUrl:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'ACO_INOX', size: '15', priceCents: 19900, stock: 4 },
      { banho: 'ACO_INOX', size: '17', priceCents: 19900, stock: 4 },
      { banho: 'OURO_18K', size: '15', priceCents: 19900, stock: 3 },
    ],
    weightInGrams: 3,
  },
  {
    id: 'p05',
    sku: 'MAB-BR-0218',
    slug: 'brinco-argola-mira',
    name: 'Brinco Argola Mira',
    description:
      'Argola média de aro liso, fecho de pressão. Versátil para o trabalho e momentos casuais.',
    categorySlug: 'brincos',
    categoryName: 'Brincos',
    collectionSlugs: ['serene'],
    tagSlugs: ['minimalista', 'best-seller'],
    imageUrl:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: 'UNICO', priceCents: 16900, stock: 18 },
      { banho: 'PRATA_925', size: 'UNICO', priceCents: 13900, stock: 14 },
    ],
    weightInGrams: 4,
  },
  {
    id: 'p06',
    sku: 'MAB-BR-0204',
    slug: 'brinco-gota-romana',
    name: 'Brinco Gota Romana',
    description:
      'Brinco em formato de gota com acabamento polido e haste fina. Movimento sutil ao caminhar.',
    categorySlug: 'brincos',
    categoryName: 'Brincos',
    collectionSlugs: ['oasis'],
    imageUrl:
      'https://images.unsplash.com/photo-1583937443566-6fe1a1c6e400?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: 'UNICO', priceCents: 22900, stock: 5 },
      { banho: 'ACO_INOX', size: 'UNICO', priceCents: 22900, stock: 3 },
    ],
    weightInGrams: 5,
  },
  {
    id: 'p07',
    sku: 'MAB-BR-0221',
    slug: 'brinco-ponto-de-luz',
    name: 'Brinco Ponto de Luz',
    description: 'Brinco compacto com zircônia cravada em garras. Versátil, ideal para o dia a dia.',
    categorySlug: 'brincos',
    categoryName: 'Brincos',
    collectionSlugs: ['serene'],
    tagSlugs: ['com-pedra', 'minimalista'],
    imageUrl:
      'https://images.unsplash.com/photo-1603561596112-db542d0afe44?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: 'UNICO', priceCents: 12900, stock: 28 },
      { banho: 'PRATA_925', size: 'UNICO', priceCents: 9900, stock: 22 },
    ],
    weightInGrams: 2,
  },
  {
    id: 'p08',
    sku: 'MAB-BR-0212',
    slug: 'maxi-brinco-solene',
    name: 'Maxi Brinco Solene',
    description:
      'Brinco statement de aro grande com detalhes ovais. Para momentos especiais.',
    categorySlug: 'brincos',
    categoryName: 'Brincos',
    collectionSlugs: ['celeste'],
    tagSlugs: ['edicao-limitada'],
    imageUrl:
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'ACO_INOX', size: 'UNICO', priceCents: 25900, stock: 3 },
      { banho: 'OURO_18K', size: 'UNICO', priceCents: 25900, stock: 3 },
    ],
    weightInGrams: 8,
  },
  {
    id: 'p09',
    sku: 'MAB-CO-0309',
    slug: 'colar-choker-allure',
    name: 'Colar Choker Allure',
    description:
      'Choker de elos finos e ajustáveis. Caimento próximo ao pescoço, fecho mosquetão.',
    categorySlug: 'colares',
    categoryName: 'Colares',
    collectionSlugs: ['serene'],
    imageUrl:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: '38cm', priceCents: 24900, stock: 9 },
      { banho: 'OURO_18K', size: '42cm', priceCents: 24900, stock: 10 },
      { banho: 'PRATA_925', size: '38cm', priceCents: 19900, stock: 6 },
    ],
    weightInGrams: 6,
  },
  {
    id: 'p10',
    sku: 'MAB-CO-0314',
    slug: 'colar-pingente-lumiere',
    name: 'Colar Pingente Lumière',
    description:
      'Corrente delicada com pingente solitário. O brilho discreto que combina com tudo.',
    categorySlug: 'colares',
    categoryName: 'Colares',
    collectionSlugs: ['oasis'],
    tagSlugs: ['com-pedra', 'best-seller'],
    imageUrl:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: '40cm', priceCents: 28900, stock: 7 },
      { banho: 'OURO_18K', size: '45cm', priceCents: 28900, stock: 7 },
    ],
    weightInGrams: 4,
  },
  {
    id: 'p11',
    sku: 'MAB-CO-0301',
    slug: 'gargantilha-constelacao',
    name: 'Gargantilha Constelação',
    description:
      'Gargantilha com micro zircônias dispostas em padrão de constelação. Peça-statement sutil.',
    categorySlug: 'colares',
    categoryName: 'Colares',
    collectionSlugs: ['celeste'],
    tagSlugs: ['com-pedra'],
    imageUrl:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'ACO_INOX', size: '40cm', priceCents: 31900, stock: 4 },
      { banho: 'OURO_18K', size: '40cm', priceCents: 31900, stock: 5 },
    ],
    weightInGrams: 7,
  },
  {
    id: 'p12',
    sku: 'MAB-CO-0322',
    slug: 'colar-veneza-fio-duplo',
    name: 'Colar Veneza Fio Duplo',
    description: 'Dois fios sobrepostos, comprimento escalonado. Para layering moderno.',
    categorySlug: 'colares',
    categoryName: 'Colares',
    collectionSlugs: ['serene'],
    imageUrl:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: '40+45cm', priceCents: 19900, stock: 11 },
      { banho: 'PRATA_925', size: '40+45cm', priceCents: 15900, stock: 9 },
    ],
    weightInGrams: 8,
  },
  {
    id: 'p13',
    sku: 'MAB-PU-0412',
    slug: 'pulseira-riviera-cristais',
    name: 'Pulseira Riviera Cristais',
    description:
      'Riviera com cravação em série. Brilho intenso, fecho de pressão de segurança.',
    categorySlug: 'pulseiras',
    categoryName: 'Pulseiras',
    collectionSlugs: ['celeste'],
    tagSlugs: ['com-pedra', 'best-seller'],
    imageUrl:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: '17cm', priceCents: 34900, stock: 4 },
      { banho: 'OURO_18K', size: '19cm', priceCents: 34900, stock: 3 },
    ],
    weightInGrams: 9,
  },
  {
    id: 'p14',
    sku: 'MAB-PU-0407',
    slug: 'bracelete-onda',
    name: 'Bracelete Onda',
    description: 'Bracelete rígido com curvas suaves. Inspirado no movimento do mar.',
    categorySlug: 'pulseiras',
    categoryName: 'Pulseiras',
    collectionSlugs: ['oasis'],
    imageUrl:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80',
    variantConfigs: [
      { banho: 'OURO_18K', size: 'M', priceCents: 26900, stock: 7 },
      { banho: 'ACO_INOX', size: 'M', priceCents: 26900, stock: 6 },
    ],
    weightInGrams: 11,
  },
];

function buildProduct(raw: RawProduct): Product {
  const variants: ProductVariant[] = raw.variantConfigs.map((v, idx) => ({
    id: `${raw.id}-v${idx + 1}`,
    sku: `${raw.sku}-${v.banho.slice(0, 2)}-${v.size}`,
    banho: v.banho,
    size: v.size,
    priceCents: v.priceCents,
    stock: v.stock,
    inStock: v.stock > 0,
    isActive: true,
  }));

  const image: ProductImage = {
    id: `${raw.id}-img1`,
    url: raw.imageUrl,
    alt: raw.name,
    order: 0,
    variantId: null,
  };

  const prices = variants.filter((v) => v.isActive).map((v) => v.priceCents);
  const stockSum = variants.reduce((acc, v) => acc + v.stock, 0);

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    status: 'ACTIVE',
    basePriceCents: prices[0] ?? 0,
    priceFromCents: prices.length ? Math.min(...prices) : 0,
    priceToCents: prices.length ? Math.max(...prices) : 0,
    inStock: stockSum > 0,
    totalStock: stockSum,
    category: { slug: raw.categorySlug, name: raw.categoryName },
    image,
    images: [image],
    variants,
  };
}

export const MOCK_PRODUCTS: Product[] = RAW.map(buildProduct);

export function getMockProductDetails(slug: string): ProductDetails | null {
  const raw = RAW.find((r) => r.slug === slug);
  if (!raw) return null;
  const base = buildProduct(raw);
  return {
    ...base,
    weightInGrams: raw.weightInGrams ?? null,
    dimensions: null,
    seoTitle: `${raw.name} — Mabruk Semijoias`,
    seoDescription: raw.description.slice(0, 160),
    tags: (raw.tagSlugs ?? []).map((slug) => ({
      id: `tag-${slug}`,
      slug,
      name: slug
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' '),
    })),
  };
}

/** Mapeia produto → coleções (para filtros por coleção) */
export const MOCK_PRODUCT_COLLECTIONS: Record<string, string[]> = Object.fromEntries(
  RAW.map((r) => [r.id, r.collectionSlugs ?? []]),
);

/** Mapeia produto → tags (para filtros por tag) */
export const MOCK_PRODUCT_TAGS: Record<string, string[]> = Object.fromEntries(
  RAW.map((r) => [r.id, r.tagSlugs ?? []]),
);
