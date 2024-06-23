import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Transfer } from '@prisma/client';

@Injectable()
export class TransfersService {
  constructor(private readonly prismaService: PrismaService) {}

  async save(data: Prisma.TransferCreateInput) {
    return this.prismaService.transfer.create({
      data,
    });
  }

  async getTransferHistory(address: string): Promise<Transfer[]> {
    return this.prismaService.transfer.findMany({
      where: {
        OR: [{ from: address }, { to: address }],
        removed: false,
      },
      orderBy: {
        blockNumber: 'desc',
      },
    });
  }
}
