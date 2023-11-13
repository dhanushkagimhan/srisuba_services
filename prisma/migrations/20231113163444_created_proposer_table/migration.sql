/*
  Warnings:

  - Added the required column `LastName` to the `Proposer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDay` to the `Proposer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Proposer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `membershipExpiration` to the `Proposer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Proposer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Proposer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Proposer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Famale');

-- CreateEnum
CREATE TYPE "FoodPreference" AS ENUM ('NonVegetarian', 'Vegetarian', 'Vegan');

-- CreateEnum
CREATE TYPE "ProposerStatus" AS ENUM ('PendingEmailVerification', 'EmailVerified', 'PendingPayment', 'PaymentApproved', 'Active', 'Reject', 'Banned');

-- AlterTable
ALTER TABLE "Proposer" ADD COLUMN     "LastName" TEXT NOT NULL,
ADD COLUMN     "bioDescription" TEXT,
ADD COLUMN     "bioTitle" TEXT,
ADD COLUMN     "birthDay" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "caste" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "civilStatus" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "drinking" BOOLEAN,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "ethnicity" TEXT,
ADD COLUMN     "fatherAdditionalInfo" TEXT,
ADD COLUMN     "fatherCaste" TEXT,
ADD COLUMN     "fatherCountryOfResidence" TEXT,
ADD COLUMN     "fatherEthnicity" TEXT,
ADD COLUMN     "fatherProfession" TEXT,
ADD COLUMN     "fatherReligion" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "foodPreference" "FoodPreference",
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "height" TEXT,
ADD COLUMN     "horoscopeMatching" BOOLEAN,
ADD COLUMN     "membershipExpiration" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "motherAdditionalInfo" TEXT,
ADD COLUMN     "motherCaste" TEXT,
ADD COLUMN     "motherCountryOfResidence" TEXT,
ADD COLUMN     "motherEthnicity" TEXT,
ADD COLUMN     "motherProfession" TEXT,
ADD COLUMN     "motherReligion" TEXT,
ADD COLUMN     "otherPictures" TEXT[],
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "smoking" BOOLEAN,
ADD COLUMN     "stateOrDistrict" TEXT,
ADD COLUMN     "status" "ProposerStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "whatsAppNumber" TEXT;
