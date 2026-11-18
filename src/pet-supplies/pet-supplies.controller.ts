import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PetSuppliesService } from './pet-supplies.service';
import { CreatePetSupplyDto } from './dto/create-pet-supply.dto';
import { UpdatePetSupplyDto } from './dto/update-pet-supply.dto';
import { RequestIdService } from '../shared/request-id/request-id.service';

@Controller('pet-supplies')
export class PetSuppliesController {
  private readonly logger = new Logger(PetSuppliesController.name);

  constructor(
    private readonly petSuppliesService: PetSuppliesService,
    private readonly requestIdService: RequestIdService,
  ) {}

  @Post()
  create(@Body() createPetSupplyDto: CreatePetSupplyDto) {
    this.logger.log(
      `[${this.requestIdService.requestId}] HTTP POST /pet-supplies`,
    );
    const data = this.petSuppliesService.create(createPetSupplyDto);
    return {
      requestId: this.requestIdService.requestId,
      data,
    };
  }

  @Get()
  findAll() {
    this.logger.log(
      `[${this.requestIdService.requestId}] HTTP GET /pet-supplies`,
    );
    const data = this.petSuppliesService.findAll();
    return {
      requestId: this.requestIdService.requestId,
      count: data.length,
      data,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(
      `[${this.requestIdService.requestId}] HTTP GET /pet-supplies/${id}`,
    );
    const data = this.petSuppliesService.findOneOrThrow(id);
    return {
      requestId: this.requestIdService.requestId,
      data,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePetSupplyDto: UpdatePetSupplyDto,
  ) {
    const data = this.petSuppliesService.update(id, updatePetSupplyDto);
    return {
      requestId: this.requestIdService.requestId,
      data,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return {
      requestId: this.requestIdService.requestId,
      ...this.petSuppliesService.remove(id),
    };
  }
}
