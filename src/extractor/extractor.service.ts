import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createPublicClient,
  http,
  Chain,
  parseAbiItem,
  defineChain,
} from 'viem';
// import { blast } from 'viem/chains';
import { sleep } from './util';
import { TransfersService } from 'src/transfers/transfers.service';

@Injectable()
export class ExtractorService implements OnModuleInit {
  private readonly logger = new Logger(ExtractorService.name);
  private chain: Chain;
  private tokenAddress: `0x${string}`;

  constructor(
    private configService: ConfigService,
    private readonly transfersService: TransfersService,
  ) {
    this.tokenAddress = this.configService.get('TOKEN_ADDRESS');

    this.chain = defineChain({
      id: this.configService.get('CHAIN_ID'),
      name: '',
      nativeCurrency: {
        decimals: 18,
        name: '',
        symbol: '',
      },
      rpcUrls: {
        default: { http: [this.configService.get('RPC_URL')] },
      },
    });
  }

  async onModuleInit() {
    this.listenToTransferEvents();
    this.backfillTransferEvents();
  }

  private async listenToTransferEvents() {
    try {
      const client = createPublicClient({
        transport: http(),
        chain: this.chain,
      });
      client.watchEvent({
        address: this.tokenAddress,
        event: parseAbiItem(
          'event Transfer(address indexed, address indexed, uint256)',
        ),
        onLogs: (logs) => this.handleTransferEvent(logs),
        onError: (error) => this.logger.error('Error in watchEvent', error),
      });
    } catch (error) {
      this.logger.error(
        'Failed to listen to transfer events. Trying again in 5 secs...',
        error,
      );
      await sleep(5000);
      this.listenToTransferEvents();
    }
  }

  private async backfillTransferEvents() {
    const client = createPublicClient({
      transport: http(),
      chain: this.chain,
    });

    const latestBlock = await client.getBlockNumber();
    let fromBlock = BigInt(0);
    const batchSize = BigInt(5000);

    while (fromBlock <= latestBlock) {
      const toBlock = fromBlock + batchSize - BigInt(1);
      try {
        const filter = await client.createEventFilter({
          address: this.tokenAddress,
          event: parseAbiItem(
            'event Transfer(address indexed, address indexed, uint256)',
          ),
          fromBlock,
          toBlock,
        });
        const logs = await client.getFilterLogs({ filter });
        await this.handleTransferEvent(logs);

        this.logger.log(`Fetched logs from block ${fromBlock} to ${toBlock}`);
        fromBlock += batchSize;
      } catch (error) {
        this.logger.error(
          `Unable to fetch logs from block ${fromBlock} to ${toBlock}. Retrying...`,
        );
        await sleep(2000);
      }
    }
  }

  private async handleTransferEvent(logs) {
    const transfers = [];
    for (const log of logs) {
      if (Number(log.args[2]) === 0) continue;

      const transfer = {
        address: log.address,
        blockNumber: Number(log.blockNumber),
        blockHash: log.blockHash,
        transactionHash: log.transactionHash,
        transactionIndex: log.transactionIndex,
        logIndex: log.logIndex,
        removed: log.removed,
        from: log.args[0],
        to: log.args[1],
        value: log.args[2].toString(),
      };

      transfers.push(transfer);
    }

    this.logger.log(`handleTransferEvent for ${transfers.length} transfers`);

    await this.transfersService.save(transfers);
  }
}
