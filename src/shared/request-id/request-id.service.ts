import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestIdService {
  private readonly logger = new Logger(RequestIdService.name);
  public readonly requestId: string;
  public readonly createdAt: string;

  constructor() {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.requestId = `REQ-${Date.now()}-${randomPart}`;
    this.createdAt = new Date().toISOString();
    this.logger.log(`Створено новий екземпляр RequestIdService: ${this.requestId}`);
  }
}