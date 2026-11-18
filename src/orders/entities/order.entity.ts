export class OrderEntity {
  orderId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  customerEmail?: string;
  status: string;
  requestId: string;
  createdAt: string;
}