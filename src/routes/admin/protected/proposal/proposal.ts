import express, { type Application, type RequestHandler } from "express";
import * as adminController from "../../../../controllers/admin";
import * as commonValidation from "../../../../utility/validations/common";

const proposalRouter: Application = express();

proposalRouter.get("/", adminController.getProposals as RequestHandler);

proposalRouter.get("/:proposerId", [
    commonValidation.getProposalValidation,
    adminController.getProposal,
] as RequestHandler[]);

export default proposalRouter;
