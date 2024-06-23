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
    required: false,
    type: 'number',
  })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    example: 10,
    description: 'Number of records per page',
    required: false,
    type: 'number',
  })
  pageSize: number = 10;

  @IsOptional()
  @IsEnum(['in', 'out'])
  @ApiProperty({
    example: 'in',
    description: 'Direction of transfer: in or out',
    required: false,
    enum: ['in', 'out'],
  })
  direction?: 'in' | 'out';
}
