import { Module } from '@nestjs/common';
import { SlugService } from './slug/slug.service';
import {
  AppConfigProvider,
  FEE_CALCULATOR,
  FeeCalculatorProvider,
  STORE_CONFIG,
} from './config/app-config.provider';
import { RequestIdService } from './request-id/request-id.service';

@Module({
  providers: [
    SlugService,
    AppConfigProvider,
    FeeCalculatorProvider,
    RequestIdService,
  ],
  exports: [
    SlugService,
    STORE_CONFIG,
    FEE_CALCULATOR,
    RequestIdService,
  ],
})
export class SharedModule {}
