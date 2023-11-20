/*
  Warnings:

  - Added the required column `status` to the `AffiliateMarketer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "aMarketerStatus" AS ENUM ('PendingEmailVerification', 'EmailVerified');

-- AlterTable
ALTER TABLE "AffiliateMarketer" ADD COLUMN     "status" "aMarketerStatus" NOT NULL;
