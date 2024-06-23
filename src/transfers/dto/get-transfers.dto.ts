import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetTransferHistoryQueryDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
  })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    example: 10,
    description: 'Number of records per page',
  })
  pageSize: number = 10;

  @IsOptional()
  @IsEnum(['in', 'out'])
  @ApiProperty({
    example: 'in',
    description: 'Direction of transfer: in or out',
  })
  direction?: 'in' | 'out';
}
