import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createPublicClient,
  http,
  formatEther,
  Chain,
  parseAbiItem,
} from 'viem';
import { blast } from 'viem/chains';
import { sleep } from './util';

@Injectable()
export class ExtractorService implements OnModuleInit {
  private readonly logger = new Logger(ExtractorService.name);
  private chain: Chain;
  private tokenAddress: `0x${string}`;

  constructor(private configService: ConfigService) {
    this.tokenAddress = this.configService.get('TOKEN_ADDRESS');
    this.chain = blast;
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
        onLogs: (logs) => {
          logs.forEach((log) => {
            const { blockNumber, args } = log;
            const [from, to, value] = args;
            this.logger.log(
              `Processing Transfer from ${from} to ${to} of ${formatEther(
                value,
              )} tokens in block ${blockNumber}`,
            );
          });
        },
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
    const batchSize = BigInt(1000);

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

        for (const log of logs) {
          const { blockNumber, args } = log;
          const [from, to, value] = args as any;
          this.logger.log(
            `Processing Transfer from ${from} to ${to} of ${formatEther(
              value,
            )} tokens in block ${blockNumber}`,
          );
        }

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
}
