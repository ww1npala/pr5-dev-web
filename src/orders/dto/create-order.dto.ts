import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'productId є обовʼязковим' })
  productId: string;

  @IsInt()
  @Min(1, { message: 'Кількість товару має бути не менше 1' })
  quantity: number;

  @IsOptional()
  @IsEmail({}, { message: 'Некоректний формат email' })
  customerEmail?: string;
}
