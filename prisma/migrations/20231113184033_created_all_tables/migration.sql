/*
  Warnings:

  - Added the required column `status` to the `MatchingProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MatchingProposal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProposerPaymentType" AS ENUM ('Initial', 'Renewal');

-- CreateEnum
CREATE TYPE "MatchingProposalStatus" AS ENUM ('Pending', 'Accept');

-- AlterTable
ALTER TABLE "MatchingProposal" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "MatchingProposalStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ProposerPayment" (
    "id" SERIAL NOT NULL,
    "type" "ProposerPaymentType" NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proposerId" INTEGER NOT NULL,

    CONSTRAINT "ProposerPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RejectOrBannedReason" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proposerId" INTEGER NOT NULL,

    CONSTRAINT "RejectOrBannedReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposerEmailVerify" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proposerId" INTEGER NOT NULL,

    CONSTRAINT "ProposerEmailVerify_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposerForgotPassword" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proposerId" INTEGER NOT NULL,

    CONSTRAINT "ProposerForgotPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateMarketer" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "affiliateCode" TEXT,
    "accountBalance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateMarketer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketerEmailVerify" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "marketerId" INTEGER NOT NULL,

    CONSTRAINT "MarketerEmailVerify_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketerForgotPassword" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "marketerId" INTEGER NOT NULL,

    CONSTRAINT "MarketerForgotPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketerReferredProposal" (
    "id" SERIAL NOT NULL,
    "paymentValue" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "marketerId" INTEGER NOT NULL,
    "proposerId" INTEGER NOT NULL,

    CONSTRAINT "MarketerReferredProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketerWithdrawal" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "marketerId" INTEGER NOT NULL,

    CONSTRAINT "MarketerWithdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "System" (
    "name" TEXT NOT NULL,
    "adminEmail" VARCHAR(255) NOT NULL,
    "adminPassword" TEXT NOT NULL,
    "proposalPrice" INTEGER NOT NULL,
    "systemIncomeBalance" INTEGER NOT NULL,
    "totalAffiliateMarketersCost" INTEGER NOT NULL,
    "totalSystemAccountBalance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "System_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "SystemWithdrawal" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemWithdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RejectOrBannedReason_proposerId_key" ON "RejectOrBannedReason"("proposerId");

-- CreateIndex
CREATE INDEX "ProposerEmailVerify_proposerId_idx" ON "ProposerEmailVerify"("proposerId");

-- CreateIndex
CREATE INDEX "ProposerForgotPassword_proposerId_idx" ON "ProposerForgotPassword"("proposerId");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateMarketer_email_key" ON "AffiliateMarketer"("email");

-- CreateIndex
CREATE INDEX "MarketerEmailVerify_marketerId_idx" ON "MarketerEmailVerify"("marketerId");

-- CreateIndex
CREATE INDEX "MarketerForgotPassword_marketerId_idx" ON "MarketerForgotPassword"("marketerId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketerReferredProposal_proposerId_key" ON "MarketerReferredProposal"("proposerId");

-- CreateIndex
CREATE INDEX "MarketerReferredProposal_marketerId_idx" ON "MarketerReferredProposal"("marketerId");

-- CreateIndex
CREATE INDEX "MarketerWithdrawal_marketerId_idx" ON "MarketerWithdrawal"("marketerId");

-- CreateIndex
CREATE UNIQUE INDEX "System_adminEmail_key" ON "System"("adminEmail");

-- AddForeignKey
ALTER TABLE "ProposerPayment" ADD CONSTRAINT "ProposerPayment_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "Proposer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectOrBannedReason" ADD CONSTRAINT "RejectOrBannedReason_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "Proposer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposerEmailVerify" ADD CONSTRAINT "ProposerEmailVerify_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "Proposer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposerForgotPassword" ADD CONSTRAINT "ProposerForgotPassword_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "Proposer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketerEmailVerify" ADD CONSTRAINT "MarketerEmailVerify_marketerId_fkey" FOREIGN KEY ("marketerId") REFERENCES "AffiliateMarketer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketerForgotPassword" ADD CONSTRAINT "MarketerForgotPassword_marketerId_fkey" FOREIGN KEY ("marketerId") REFERENCES "AffiliateMarketer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketerReferredProposal" ADD CONSTRAINT "MarketerReferredProposal_marketerId_fkey" FOREIGN KEY ("marketerId") REFERENCES "AffiliateMarketer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketerReferredProposal" ADD CONSTRAINT "MarketerReferredProposal_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "Proposer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketerWithdrawal" ADD CONSTRAINT "MarketerWithdrawal_marketerId_fkey" FOREIGN KEY ("marketerId") REFERENCES "AffiliateMarketer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
