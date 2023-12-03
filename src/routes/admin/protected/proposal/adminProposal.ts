import express, { type Application, type RequestHandler } from "express";
import * as adminController from "../../../../controllers/admin";
import * as commonValidation from "../../../../utility/validations/common";
import * as adminValidation from "../../../../utility/validations/admin";

const adminProposalRouter: Application = express();

adminProposalRouter.get("/", [
    adminValidation.getAllProposalsValidation,
    adminController.getAllProposals,
] as RequestHandler[]);

adminProposalRouter.get("/:proposerId", [
    commonValidation.getProposalValidation,
    adminController.getProposal,
] as RequestHandler[]);

adminProposalRouter.post("/approve-payment", [
    adminValidation.approvePaymentValidation,
    adminController.approveProposerPayment,
] as RequestHandler[]);

adminProposalRouter.post("/change-status", [
    adminValidation.changeProposerStatusValidation,
    adminController.changeProposerStatus,
] as RequestHandler[]);

adminProposalRouter.post("/renew-membership", [
    adminValidation.renewMembershipValidation,
    adminController.renewMembership,
] as RequestHandler[]);

export default adminProposalRouter;
