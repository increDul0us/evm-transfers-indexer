/*
  Warnings:

  - A unique constraint covering the columns `[transactionHash,logIndex]` on the table `Transfer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transfer_transactionHash_logIndex_key" ON "Transfer"("transactionHash", "logIndex");
