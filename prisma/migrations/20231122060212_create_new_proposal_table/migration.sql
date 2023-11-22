/*
  Warnings:

  - You are about to drop the column `bioDescription` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `bioTitle` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `caste` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `civilStatus` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `drinking` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `ethnicity` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `fatherAdditionalInfo` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `fatherCaste` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `fatherCountryOfResidence` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `fatherEthnicity` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `fatherProfession` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `fatherReligion` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `foodPreference` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `horoscopeMatching` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `motherAdditionalInfo` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `motherCaste` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `motherCountryOfResidence` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `motherEthnicity` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `motherProfession` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `motherReligion` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `otherPictures` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `profession` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhoto` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `smoking` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `stateOrDistrict` on the `Proposer` table. All the data in the column will be lost.
  - You are about to drop the column `whatsAppNumber` on the `Proposer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proposer" DROP COLUMN "bioDescription",
DROP COLUMN "bioTitle",
DROP COLUMN "caste",
DROP COLUMN "city",
DROP COLUMN "civilStatus",
DROP COLUMN "country",
DROP COLUMN "drinking",
DROP COLUMN "education",
DROP COLUMN "ethnicity",
DROP COLUMN "fatherAdditionalInfo",
DROP COLUMN "fatherCaste",
DROP COLUMN "fatherCountryOfResidence",
DROP COLUMN "fatherEthnicity",
DROP COLUMN "fatherProfession",
DROP COLUMN "fatherReligion",
DROP COLUMN "foodPreference",
DROP COLUMN "height",
DROP COLUMN "horoscopeMatching",
DROP COLUMN "motherAdditionalInfo",
DROP COLUMN "motherCaste",
DROP COLUMN "motherCountryOfResidence",
DROP COLUMN "motherEthnicity",
DROP COLUMN "motherProfession",
DROP COLUMN "motherReligion",
DROP COLUMN "otherPictures",
DROP COLUMN "profession",
DROP COLUMN "profilePhoto",
DROP COLUMN "religion",
DROP COLUMN "smoking",
DROP COLUMN "stateOrDistrict",
DROP COLUMN "whatsAppNumber";

-- CreateTable
CREATE TABLE "Proposal" (
    "id" SERIAL NOT NULL,
    "profilePhoto" TEXT NOT NULL,
    "otherPictures" TEXT[],
    "bioTitle" TEXT,
    "bioDescription" TEXT,
    "whatsAppNumber" TEXT NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "caste" TEXT,
    "civilStatus" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "stateOrDistrict" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "drinking" BOOLEAN NOT NULL,
    "smoking" BOOLEAN NOT NULL,
    "foodPreference" "FoodPreference" NOT NULL,
    "fatherEthnicity" TEXT NOT NULL,
    "fatherReligion" TEXT NOT NULL,
    "fatherCaste" TEXT,
    "fatherProfession" TEXT,
    "fatherCountryOfResidence" TEXT NOT NULL,
    "fatherAdditionalInfo" TEXT,
    "motherEthnicity" TEXT NOT NULL,
    "motherReligion" TEXT NOT NULL,
    "motherCaste" TEXT,
    "motherProfession" TEXT,
    "motherCountryOfResidence" TEXT NOT NULL,
    "motherAdditionalInfo" TEXT,
    "horoscopeMatching" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proposerId" INTEGER NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_proposerId_key" ON "Proposal"("proposerId");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "Proposer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
