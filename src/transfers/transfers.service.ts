import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Transfer } from '@prisma/client';

@Injectable()
export class TransfersService {
  constructor(private readonly prismaService: PrismaService) {}

  async save(data: Prisma.TransferCreateManyInput[]) {
    return this.prismaService.transfer.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async getTransferHistory(
    address: string,
  ): Promise<Pick<Transfer, 'from' | 'to' | 'value' | 'transactionHash'>[]> {
    return this.prismaService.transfer.findMany({
      where: {
        OR: [{ from: address }, { to: address }],
        removed: false,
      },
      orderBy: {
        blockNumber: 'desc',
      },
      select: { from: true, to: true, value: true, transactionHash: true },
    });
  }
}
