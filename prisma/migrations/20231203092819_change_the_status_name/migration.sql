/*
  Warnings:

  - Changed the type of `status` on the `AffiliateMarketer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AMarketerStatus" AS ENUM ('PendingEmailVerification', 'EmailVerified');

-- AlterTable
ALTER TABLE "AffiliateMarketer" DROP COLUMN "status",
ADD COLUMN     "status" "AMarketerStatus" NOT NULL;

-- DropEnum
DROP TYPE "aMarketerStatus";
