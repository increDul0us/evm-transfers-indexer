# Ethereum Blockchain Transfers Indexer System

This project provides a real-time Ethereum blockchain indexer system for transfers on specific chain and token, designed to monitor and store transfer transactions interacting with provided token smart contract. The system consists of Extractor Service and Transfers service which uses Postgres for data persistence.

## Overview

- **Extractor Service**: This service is designed to both listen for new Ethereum events and also fetch past Ethereum events for backfill and processes them. It uses the viem library to interact with the Ethereum blockchain.
- **Transfer Service**: Provides endpoints for CRUD operations on transfer transaction data stored in postgres and stores transfer transaction.

## Requirements
- Docker and Docker Compose
- Node Version Manager (nvm) for test

## Installation
Clone this repository and navigate to the project directory.
```bash
git clone https://github.com/increDul0us/evm-transfers-indexer
cd evm-transfers-indexer
```

## Quick start:

  ```bash
    cp .env.sample .env
    docker-compose -p evm-transfers-indexer up -d
    docker logs evm-transfers-indexer_app_1 -f
  ```
## Test:

  ```bash
    nvm install && nvm use
    npm i
    npm test
  ```

## Usage
The API is running on port 3333. There is an automatically generated API documentation when server is running. the API can be viewed at [http://localhost:3333/api](http://localhost:3333/api).

### API Endpoints
GET /transfers/:address: Fetches transfer history for an address
```http
GET http://localhost:3333/transfers/0x4aF1f00F50EfBFcDF7a8F2ac02e9BC24825438Ac
{
  "status": "success",
  "data": [
  {
    "from": "0x8951C3593B34Daa00A3F9d68cB5Bad6C42ab8d82",
    "to": "0x4aF1f00F50EfBFcDF7a8F2ac02e9BC24825438Ac",
    "value": "5729156217667812",
    "transactionHash": "0xde048f39b0795c98874d95b5a5165f57fa345a34ab7e7b974f5bb00e6b5105ad"
  },
  ],
}
```

## TODO
- [ ] Handle missing events. Events missed due to watchEvent disconnection or error can be handled.
- [ ] Backfill should not always start from block 0. We can get the last saved block and continue backfill from there.
- [ ] Handle removed events.
- [ ] Make extractor not dependent on transfer service (DB). Can add a queue in between that holds the transfer transactions.
