/*
  Warnings:

  - Added the required column `country` to the `AffiliateMarketer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `AffiliateMarketer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AffiliateMarketer" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL;
