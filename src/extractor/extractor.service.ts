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
      });
    } catch (error) {
      this.logger.error(
        'failed to listen to transfer events. Trying again in 5 secs...',
        error,
      );
      await sleep(5000);
      this.listenToTransferEvents();
    }
  }
}
