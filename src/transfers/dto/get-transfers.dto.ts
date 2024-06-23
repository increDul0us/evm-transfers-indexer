import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTransferHistoryQueryDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  pageSize: number = 10;

  @IsOptional()
  @IsEnum(['in', 'out'])
  direction?: 'in' | 'out';
}
