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

@Controller('transfers')
@UsePipes(new ValidationPipe())
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get(':address')
  async getTransfersHistory(
    @Param('address') address: string,
    @Query() query: GetTransferHistoryQueryDto,
  ) {
    return this.transfersService.getTransferHistory(
      address,
      Number(query.page),
      Number(query.pageSize),
      query.direction,
    );
  }
}
