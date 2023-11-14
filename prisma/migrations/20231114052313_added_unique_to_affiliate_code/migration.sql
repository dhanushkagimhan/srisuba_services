/*
  Warnings:

  - A unique constraint covering the columns `[affiliateCode]` on the table `AffiliateMarketer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AffiliateMarketer_affiliateCode_key" ON "AffiliateMarketer"("affiliateCode");
