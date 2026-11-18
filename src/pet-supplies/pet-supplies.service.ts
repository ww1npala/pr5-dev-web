import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PetSupplyEntity } from './entities/pet-supply.entity';
import { CreatePetSupplyDto } from './dto/create-pet-supply.dto';
import { UpdatePetSupplyDto } from './dto/update-pet-supply.dto';
import { SlugService } from '../shared/slug/slug.service';
import { RequestIdService } from '../shared/request-id/request-id.service';

@Injectable()
export class PetSuppliesService implements OnModuleInit {
  private readonly logger = new Logger(PetSuppliesService.name);
  private readonly items: PetSupplyEntity[] = [];
  private idCounter = 1;

  constructor(
    private readonly slugService: SlugService,
    private readonly requestIdService: RequestIdService,
  ) {}

  onModuleInit(): void {
    const initialSupplies: CreatePetSupplyDto[] = [
      {
        title: 'Сухий корм Royal Canin для котів 2 кг',
        category: 'Корм',
        petType: 'Коти',
        price: 1250,
        stock: 15,
      },
      {
        title: 'Інтерактивна іграшка-мʼяч для собак',
        category: 'Іграшки',
        petType: 'Собаки',
        price: 380,
        stock: 30,
      },
    ];

    initialSupplies.forEach((dto) => {
      const entity: PetSupplyEntity = {
        id: `pet-${this.idCounter++}`,
        title: dto.title,
        slug: this.slugService.generateSlug(dto.title),
        category: dto.category,
        petType: dto.petType,
        price: dto.price,
        stock: dto.stock,
        createdAt: new Date().toISOString(),
      };
      this.items.push(entity);
    });

    this.logger.log(
      'Ініціалізація модуля завершена. Завантажено початкові тестові дані.',
    );
  }

  create(dto: CreatePetSupplyDto): PetSupplyEntity {
    this.logger.log(
      `[${this.requestIdService.requestId}] Створення нового зоотовару: "${dto.title}"`,
    );

    const newItem: PetSupplyEntity = {
      id: `pet-${this.idCounter++}`,
      title: dto.title,
      slug: this.slugService.generateSlug(dto.title),
      category: dto.category,
      petType: dto.petType,
      price: dto.price,
      stock: dto.stock,
      createdAt: new Date().toISOString(),
    };

    this.items.push(newItem);
    return newItem;
  }

  findAll(): PetSupplyEntity[] {
    this.logger.log(
      `[${this.requestIdService.requestId}] Отримання списку всіх зоотоварів (${this.items.length} шт.)`,
    );
    return this.items;
  }

  findOne(id: string): PetSupplyEntity | undefined {
    return this.items.find((item) => item.id === id);
  }

  findOneOrThrow(id: string): PetSupplyEntity {
    const item = this.findOne(id);
    if (!item) {
      throw new NotFoundException(`Зоотовар з ідентифікатором "${id}" не знайдено`);
    }
    return item;
  }

  update(id: string, dto: UpdatePetSupplyDto): PetSupplyEntity {
    const item = this.findOneOrThrow(id);

    if (dto.title !== undefined) {
      item.title = dto.title;
      item.slug = this.slugService.generateSlug(dto.title);
    }
    if (dto.category !== undefined) item.category = dto.category;
    if (dto.petType !== undefined) item.petType = dto.petType;
    if (dto.price !== undefined) item.price = dto.price;
    if (dto.stock !== undefined) item.stock = dto.stock;

    return item;
  }

  remove(id: string): { deleted: boolean; id: string } {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Зоотовар з ідентифікатором "${id}" не знайдено`);
    }
    this.items.splice(index, 1);
    return { deleted: true, id };
  }
}