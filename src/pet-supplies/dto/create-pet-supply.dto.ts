import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreatePetSupplyDto {
  @IsString()
  @IsNotEmpty({ message: 'Назва зоотовару не може бути порожньою' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Категорія товару є обовʼязковою' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'Вид тварини є обовʼязковим' })
  petType: string;

  @IsNumber()
  @IsPositive({ message: 'Ціна повинна бути більшою за 0' })
  price: number;

  @IsInt()
  @Min(0, { message: 'Кількість на складі не може бути відʼємною' })
  stock: number;
}