/*
  Warnings:

  - You are about to drop the column `status` on the `MarketerReferredProposal` table. All the data in the column will be lost.
  - Added the required column `paymentStatus` to the `MarketerReferredProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarketerReferredProposal" DROP COLUMN "status",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL;
