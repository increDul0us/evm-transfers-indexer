import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { GetTransferHistoryQueryDto } from './dto/get-transfers.dto';
import { ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('transfers')
@Controller('transfers')
@UsePipes(new ValidationPipe())
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get(':address')
  @ApiParam({
    name: 'address',
    description: 'The address to query transfer history for',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of transfer history',
  })
  async getTransfersHistory(
    @Param('address') address: string,
    @Query() { page = 1, pageSize = 10, direction }: GetTransferHistoryQueryDto,
  ) {
    return this.transfersService.getTransferHistory(
      address,
      Number(page),
      Number(pageSize),
      direction,
    );
  }
}
