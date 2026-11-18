import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PetSuppliesModule } from './pet-supplies/pet-supplies.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [SharedModule, PetSuppliesModule, OrdersModule],
})
export class AppModule {}