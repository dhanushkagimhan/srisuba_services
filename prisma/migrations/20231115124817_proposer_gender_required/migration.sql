/*
  Warnings:

  - Made the column `gender` on table `Proposer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Proposer" ALTER COLUMN "gender" SET NOT NULL;
