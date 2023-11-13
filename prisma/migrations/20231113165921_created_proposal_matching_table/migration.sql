-- CreateTable
CREATE TABLE "MatchingProposal" (
    "id" SERIAL NOT NULL,
    "proposerId" INTEGER NOT NULL,
    "proposeReceiverId" INTEGER NOT NULL,

    CONSTRAINT "MatchingProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchingProposal_proposerId_proposeReceiverId_key" ON "MatchingProposal"("proposerId", "proposeReceiverId");

-- AddForeignKey
ALTER TABLE "MatchingProposal" ADD CONSTRAINT "MatchingProposal_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "Proposer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingProposal" ADD CONSTRAINT "MatchingProposal_proposeReceiverId_fkey" FOREIGN KEY ("proposeReceiverId") REFERENCES "Proposer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
