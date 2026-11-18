import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RequestIdService } from '../shared/request-id/request-id.service';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly requestIdService: RequestIdService,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    this.logger.log(
      `[${this.requestIdService.requestId}] HTTP POST /orders`,
    );
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  findAll() {
    this.logger.log(
      `[${this.requestIdService.requestId}] HTTP GET /orders`,
    );
    return {
      requestId: this.requestIdService.requestId,
      count: this.ordersService.findAll().length,
      data: this.ordersService.findAll(),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}