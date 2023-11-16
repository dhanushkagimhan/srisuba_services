/*
  Warnings:

  - A unique constraint covering the columns `[marketerId]` on the table `MarketerEmailVerify` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[marketerId]` on the table `MarketerForgotPassword` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[proposerId]` on the table `ProposerEmailVerify` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[proposerId]` on the table `ProposerForgotPassword` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MarketerEmailVerify_marketerId_idx";

-- DropIndex
DROP INDEX "MarketerForgotPassword_marketerId_idx";

-- DropIndex
DROP INDEX "ProposerEmailVerify_proposerId_idx";

-- DropIndex
DROP INDEX "ProposerForgotPassword_proposerId_idx";

-- CreateTable
CREATE TABLE "MarketerBankAccount" (
    "id" SERIAL NOT NULL,
    "bankName" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "marketerId" INTEGER NOT NULL,

    CONSTRAINT "MarketerBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketerBankAccount_marketerId_key" ON "MarketerBankAccount"("marketerId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketerEmailVerify_marketerId_key" ON "MarketerEmailVerify"("marketerId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketerForgotPassword_marketerId_key" ON "MarketerForgotPassword"("marketerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProposerEmailVerify_proposerId_key" ON "ProposerEmailVerify"("proposerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProposerForgotPassword_proposerId_key" ON "ProposerForgotPassword"("proposerId");

-- AddForeignKey
ALTER TABLE "MarketerBankAccount" ADD CONSTRAINT "MarketerBankAccount_marketerId_fkey" FOREIGN KEY ("marketerId") REFERENCES "AffiliateMarketer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
