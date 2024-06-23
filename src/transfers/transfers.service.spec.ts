import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TransfersService } from './transfers.service';

const transferArray = [
  {
    from: '0x123',
    to: '0x456',
    value: '100',
    transactionHash: '0xabc',
  },
  {
    from: '0x789',
    to: '0x456',
    value: '200',
    transactionHash: '0xdef',
  },
];

const db = {
  transfer: {
    createMany: jest.fn().mockResolvedValue({ count: 2 }),
    findFirst: jest.fn().mockResolvedValue({ blockNumber: 2 }),
    findMany: jest.fn().mockResolvedValue(transferArray),
  },
};

describe('TransfersService', () => {
  let service: TransfersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransfersService, { provide: PrismaService, useValue: db }],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save', () => {
    it('should save transfers and skip duplicates', async () => {
      const result = await service.save(transferArray as any);
      expect(result).toEqual({ count: 2 });
      expect(prisma.transfer.createMany).toHaveBeenCalledWith({
        data: transferArray,
        skipDuplicates: true,
      });
    });
  });

  describe('getTransferHistory', () => {
    it('should return transfer history for a given address', async () => {
      const address = '0x456';
      const result = await service.getTransferHistory(address);
      expect(result).toEqual(transferArray);
      expect(prisma.transfer.findMany).toHaveBeenCalledWith({
        where: {
          removed: false,
          OR: [{ to: address }, { from: address }],
        },
        orderBy: {
          blockNumber: 'desc',
        },
        select: { from: true, to: true, value: true, transactionHash: true },
        skip: 0,
        take: 10,
      });
    });

    it('should apply pagination', async () => {
      const address = '0x456';
      const result = await service.getTransferHistory(address, 2, 5);
      expect(result).toEqual(transferArray);
      expect(prisma.transfer.findMany).toHaveBeenCalledWith({
        where: {
          removed: false,
          OR: [{ to: address }, { from: address }],
        },
        orderBy: {
          blockNumber: 'desc',
        },
        select: { from: true, to: true, value: true, transactionHash: true },
        skip: 5,
        take: 5,
      });
    });

    it('should filter only inbound transactions', async () => {
      const address = '0x456';
      const result = await service.getTransferHistory(address, 1, 10, 'in');
      expect(result).toEqual(transferArray);
      expect(prisma.transfer.findMany).toHaveBeenCalledWith({
        where: {
          removed: false,
          OR: [{ to: address }],
        },
        orderBy: {
          blockNumber: 'desc',
        },
        select: { from: true, to: true, value: true, transactionHash: true },
        skip: 0,
        take: 10,
      });
    });

    it('should filter only outbound transactions', async () => {
      const address = '0x456';
      const result = await service.getTransferHistory(address, 1, 10, 'out');
      expect(result).toEqual(transferArray);
      expect(prisma.transfer.findMany).toHaveBeenCalledWith({
        where: {
          removed: false,
          OR: [{ from: address }],
        },
        orderBy: {
          blockNumber: 'desc',
        },
        select: { from: true, to: true, value: true, transactionHash: true },
        skip: 0,
        take: 10,
      });
    });
  });
});
