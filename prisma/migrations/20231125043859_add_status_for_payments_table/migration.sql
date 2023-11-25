/*
  Warnings:

  - Added the required column `status` to the `MarketerReferredProposal` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentValue` on table `MarketerReferredProposal` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `status` to the `ProposerPayment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Approved');

-- AlterTable
ALTER TABLE "MarketerReferredProposal" ADD COLUMN     "status" "PaymentStatus" NOT NULL,
ALTER COLUMN "paymentValue" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProposerPayment" ADD COLUMN     "status" "PaymentStatus" NOT NULL;
