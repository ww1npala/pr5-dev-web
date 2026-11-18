import { Provider } from '@nestjs/common';

export const STORE_CONFIG = 'STORE_CONFIG';
export const FEE_CALCULATOR = 'FEE_CALCULATOR';

export interface StoreConfig {
  storeName: string;
  defaultCurrency: string;
  taxPercent: number;
}

export interface FeeCalculator {
  calculateTax: (amount: number) => number;
}

export const AppConfigProvider: Provider<StoreConfig> = {
  provide: STORE_CONFIG,
  useValue: {
    storeName: 'ZooMarket — Інтернет-магазин зоотоварів',
    defaultCurrency: 'UAH',
    taxPercent: 20,
  },
};

export const FeeCalculatorProvider: Provider<FeeCalculator> = {
  provide: FEE_CALCULATOR,
  useFactory: (config: StoreConfig): FeeCalculator => {
    return {
      calculateTax: (amount: number): number => {
        const tax = amount * (config.taxPercent / 100);
        return Math.round(tax * 100) / 100;
      },
    };
  },
  inject: [STORE_CONFIG],
};