import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PetSuppliesModule } from '../pet-supplies/pet-supplies.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [PetSuppliesModule, SharedModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}