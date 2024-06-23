import { Controller, Get, Param } from '@nestjs/common';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get(':address')
  async getTransfersHistory(@Param('address') address: string) {
    return this.transfersService.getTransferHistory(address);
  }
}
