import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransfersService {
  constructor(private readonly prismaService: PrismaService) {}

  async save(data: Prisma.TransferCreateInput) {
    return this.prismaService.transfer.create({
      data,
    });
  }
}
