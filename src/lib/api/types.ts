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

export type Banho = 'OURO_18K' | 'PRATA_925' | 'ACO_INOX';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface ProductVariant {
  id: string;
  sku: string;
  banho: Banho;
  size: string;
  priceCents: number;
  stock: number;
  inStock: boolean;
  isActive: boolean;
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
  weightInGrams: number | null;
  dimensions: { length: number | null; width: number | null; height: number | null } | null;
  seoTitle: string | null;
  seoDescription: string | null;
  tags: ProductTag[];
}

export interface ProductListResult {
  items: Product[];
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
  banho?: Banho;
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
  banho: Banho;
  size: string;
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
    banho: Banho;
    size: string;
    sku: string;
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
