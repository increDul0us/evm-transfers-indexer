import { Controller, Get, Param } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { Transfer } from '@prisma/client';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get(':address')
  async getTransfersHistory(
    @Param('address') address: string,
  ): Promise<Transfer[]> {
    return this.transfersService.getTransferHistory(address);
  }
}
