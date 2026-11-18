import { Module, OnModuleInit } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PetSuppliesModule } from '../pet-supplies/pet-supplies.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [PetSuppliesModule, SharedModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onModuleInit(): Promise<void> {
    const contextId = ContextIdFactory.create();
    const service = await this.moduleRef.resolve(OrdersService, contextId, {
      strict: false,
    });
    service.onModuleInit();
  }
}
