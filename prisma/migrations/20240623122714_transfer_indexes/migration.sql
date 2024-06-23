-- CreateIndex
CREATE INDEX "from_idx" ON "Transfer"("from");

-- CreateIndex
CREATE INDEX "to_idx" ON "Transfer"("to");

-- CreateIndex
CREATE INDEX "blockNumber_idx" ON "Transfer"("blockNumber");
