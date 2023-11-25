import express, { type Application, type RequestHandler } from "express";
import * as adminController from "../../../../controllers/admin";
import * as commonValidation from "../../../../utility/validations/common";

const adminProposalRouter: Application = express();

adminProposalRouter.get("/", adminController.getProposals as RequestHandler);

adminProposalRouter.get("/:proposerId", [
    commonValidation.getProposalValidation,
    adminController.getProposal,
] as RequestHandler[]);

export default adminProposalRouter;
