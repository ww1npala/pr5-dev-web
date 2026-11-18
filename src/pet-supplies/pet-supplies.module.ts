import { Module, OnModuleInit } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PetSuppliesController } from './pet-supplies.controller';
import { PetSuppliesService } from './pet-supplies.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [PetSuppliesController],
  providers: [PetSuppliesService],
  exports: [PetSuppliesService],
})
export class PetSuppliesModule implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onModuleInit(): Promise<void> {
    const contextId = ContextIdFactory.create();
    const service = await this.moduleRef.resolve(PetSuppliesService, contextId, {
      strict: false,
    });
    service.onModuleInit();
  }
}
