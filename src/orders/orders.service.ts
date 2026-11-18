import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PetSuppliesService } from '../pet-supplies/pet-supplies.service';
import {
  FEE_CALCULATOR,
  FeeCalculator,
  STORE_CONFIG,
  StoreConfig,
} from '../shared/config/app-config.provider';
import { RequestIdService } from '../shared/request-id/request-id.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private static readonly orders: OrderEntity[] = [];
  private static isInitialized = false;

  constructor(
    private readonly petSuppliesService: PetSuppliesService,
    @Inject(STORE_CONFIG) private readonly storeConfig: StoreConfig,
    @Inject(FEE_CALCULATOR) private readonly feeCalculator: FeeCalculator,
    private readonly requestIdService: RequestIdService,
  ) {}

  onModuleInit(): void {
    if (OrdersService.isInitialized) {
      return;
    }
    OrdersService.isInitialized = true;
    this.logger.log(
      `Сервіс замовлень успішно підключено до білінгу та каталогу (${this.storeConfig.storeName}).`,
    );
  }

  createOrder(dto: CreateOrderDto): OrderEntity {
    this.logger.log(
      `[${this.requestIdService.requestId}] Оформлення замовлення для товару ${dto.productId}, кількість: ${dto.quantity}`,
    );

    const product = this.petSuppliesService.findOne(dto.productId);
    if (!product) {
      throw new NotFoundException(
        `Товар із productId="${dto.productId}" не знайдено у каталозі зоотоварів`,
      );
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Недостатньо товару на складі (доступно: ${product.stock}, запитано: ${dto.quantity})`,
      );
    }

    product.stock -= dto.quantity;

    const subtotal = Math.round(product.price * dto.quantity * 100) / 100;
    const taxAmount = this.feeCalculator.calculateTax(subtotal);
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    const order: OrderEntity = {
      orderId: `ord-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      unitPrice: product.price,
      quantity: dto.quantity,
      subtotal,
      taxAmount,
      total,
      currency: this.storeConfig.defaultCurrency,
      customerEmail: dto.customerEmail,
      status: 'confirmed',
      requestId: this.requestIdService.requestId,
      createdAt: new Date().toISOString(),
    };

    OrdersService.orders.push(order);
    return order;
  }

  findAll(): OrderEntity[] {
    this.logger.log(
      `[${this.requestIdService.requestId}] Запит списку замовлень (${OrdersService.orders.length} шт.)`,
    );
    return OrdersService.orders;
  }

  findOne(orderId: string): OrderEntity {
    const order = OrdersService.orders.find((o) => o.orderId === orderId);
    if (!order) {
      throw new NotFoundException(`Замовлення з ID "${orderId}" не знайдено`);
    }
    return order;
  }
}
