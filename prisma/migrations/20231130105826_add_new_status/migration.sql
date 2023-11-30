/*
  Warnings:

  - The values [Accept] on the enum `MatchingProposalStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Reject] on the enum `ProposerStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MatchingProposalStatus_new" AS ENUM ('Pending', 'Accepted', 'Rejected');
ALTER TABLE "MatchingProposal" ALTER COLUMN "status" TYPE "MatchingProposalStatus_new" USING ("status"::text::"MatchingProposalStatus_new");
ALTER TYPE "MatchingProposalStatus" RENAME TO "MatchingProposalStatus_old";
ALTER TYPE "MatchingProposalStatus_new" RENAME TO "MatchingProposalStatus";
DROP TYPE "MatchingProposalStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProposerStatus_new" AS ENUM ('PendingEmailVerification', 'EmailVerified', 'PendingPayment', 'PaymentApproved', 'Active', 'Rejected', 'RejectionResolved', 'Banned', 'BannedResolved');
ALTER TABLE "Proposer" ALTER COLUMN "status" TYPE "ProposerStatus_new" USING ("status"::text::"ProposerStatus_new");
ALTER TYPE "ProposerStatus" RENAME TO "ProposerStatus_old";
ALTER TYPE "ProposerStatus_new" RENAME TO "ProposerStatus";
DROP TYPE "ProposerStatus_old";
COMMIT;
