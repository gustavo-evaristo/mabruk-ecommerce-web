/**
 * Tipos compartilhados entre frontend e API.
 * Espelham os presenters em `api/src/infra/controllers/presenters/*.ts`
 * e os controllers B2C.
 *
 * Money sempre em centavos (Int). Use `formatMoney()` para exibir.
 */

// ============================================================
// Catálogo — Product
// ============================================================

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type ProductType = 'SIMPLE' | 'VARIABLE';
export type AttributeType = 'SELECT' | 'COLOR';

/** Valor de atributo aplicado a uma variante (ex: variante = "Ouro 18k" + "Azul"). */
export interface VariantAttributeValue {
  attributeId: string;
  attributeSlug: string;
  attributeName: string;
  attributeType: AttributeType;
  valueId: string;
  valueSlug: string;
  valueName: string;
  valueHex: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  priceCents: number;
  stock: number;
  inStock: boolean;
  isActive: boolean;
  weightInGrams: number | null;
  isDefault: boolean;
  attributeValues: VariantAttributeValue[];
}

/** Atributo cadastrado num produto VARIABLE (Cor, Banho, Tamanho…). */
export interface ProductAttributeDefinition {
  id: string;
  slug: string;
  name: string;
  type: AttributeType;
  order: number;
  values: { id: string; slug: string; name: string; hex: string | null; order: number }[];
}

/** Faceta dinâmica retornada pela PLP. */
export interface AvailableAttribute {
  slug: string;
  name: string;
  type: AttributeType;
  values: { slug: string; name: string; hex: string | null; count: number }[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  variantId: string | null;
}

export interface ProductTag {
  id: string;
  slug: string;
  name: string;
}

export interface CategoryRef {
  slug: string;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: ProductStatus;
  type: ProductType;
  basePriceCents: number;
  priceFromCents: number;
  priceToCents: number;
  inStock: boolean;
  totalStock: number;
  category: CategoryRef;
  image: ProductImage | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductDetails extends Product {
  /** Definição dos atributos que esse produto VARIABLE usa (em ordem). Vazio em SIMPLE. */
  attributes: ProductAttributeDefinition[];
  weightInGrams: number | null;
  dimensions: { length: number | null; width: number | null; height: number | null } | null;
  seoTitle: string | null;
  seoDescription: string | null;
  tags: ProductTag[];
}

export interface ProductListResult {
  items: Product[];
  availableAttributes: AvailableAttribute[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductListFilters {
  search?: string;
  category?: string;
  collection?: string;
  tag?: string;
  /** Filtros por atributo: { 'cor': ['azul','vermelho'], 'banho': ['ouro-18k'] } */
  attributeFilters?: Record<string, string[]>;
  minPriceCents?: number;
  maxPriceCents?: number;
  inStock?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
  page?: number;
  pageSize?: number;
}

// ============================================================
// Catálogo — Category / Collection / Tag / Banner
// ============================================================

export interface Category {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  order: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  order: number;
}

export interface CollectionDetails {
  collection: Collection;
  products: ProductListResult;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  alt: string | null;
  order: number;
}

// ============================================================
// Carrinho
// ============================================================

export interface CartLine {
  itemId: string;
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  /** Atributos da variante. Vazio em produto SIMPLE. */
  attributes: { name: string; value: string }[];
  sku: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
  stock: number;
  imageUrl: string | null;
}

export interface CartView {
  cartId: string;
  lines: CartLine[];
  subtotalCents: number;
  totalItems: number;
}

export interface CreateCartResponse {
  cartId: string;
  guestToken: string | null;
}

// ============================================================
// Frete + Checkout + Pagamento
// ============================================================

export interface ShippingOption {
  service: string;
  carrier: string;
  costCents: number;
  estimatedDays: number;
  free?: boolean;
}

export interface ShippingQuoteResult {
  options: ShippingOption[];
  subtotalCents: number;
}

export interface ShippingAddressPayload {
  recipient: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CheckoutCustomerPayload {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
}

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
  grandTotalCents: number;
}

export type PaymentMethod = 'PIX' | 'CREDIT_CARD';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';

export interface PixIntent {
  paymentId: string;
  providerTxId: string;
  status: PaymentStatus;
  qrCode: string | null;
  qrCodeBase64: string | null;
  expiresAt: string | null;
  amountCents: number;
}

export interface CardIntent {
  paymentId: string;
  status: PaymentStatus;
  installments: number;
}

// ============================================================
// Pedidos
// ============================================================

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED'
  | 'REFUNDED';

export interface OrderSummary {
  id: string;
  number: string;
  status: OrderStatus;
  itemsTotalCents: number;
  shippingTotalCents: number;
  grandTotalCents: number;
  createdAt: string;
  customer: CheckoutCustomerPayload;
}

export interface OrderItem {
  id: string;
  productSnapshot: {
    productId: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    sku: string;
    attributes: { name: string; value: string }[];
  };
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface OrderPayment {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amountCents: number;
  installments: number | null;
  qrCode?: string | null;
  qrCodeBase64?: string | null;
  expiresAt?: string | null;
  paidAt: string | null;
}

export interface OrderShipment {
  carrier: string;
  service: string;
  costCents: number;
  estimatedDays: number;
  trackingCode: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

export interface OrderDetails {
  order: OrderSummary & { invoiceNumber?: string | null };
  items: OrderItem[];
  payments: OrderPayment[];
  shipment: OrderShipment | null;
}

// ============================================================
// Cliente / Endereços
// ============================================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpfCnpj: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string | null;
  recipient: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface AuthResult {
  customer: Pick<Customer, 'id' | 'name' | 'email'>;
  token: string;
}

// ============================================================
// CEP (ViaCEP wrapper)
// ============================================================

export interface CepLookupResult {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string | null;
}
