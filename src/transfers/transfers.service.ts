import { BadRequestException, Injectable } from '@nestjs/common';
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
    page = 1,
    pageSize = 10,
    direction?: 'in' | 'out',
  ): Promise<Pick<Transfer, 'from' | 'to' | 'value' | 'transactionHash'>[]> {
    try {
      const directionFilter: Prisma.TransferWhereInput = {
        OR: [
          direction !== 'out' && { to: address },
          direction !== 'in' && { from: address },
        ].filter(Boolean),
      };
      return this.prismaService.transfer.findMany({
        where: { ...directionFilter, removed: false },
        orderBy: {
          blockNumber: 'desc',
        },
        select: { from: true, to: true, value: true, transactionHash: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
