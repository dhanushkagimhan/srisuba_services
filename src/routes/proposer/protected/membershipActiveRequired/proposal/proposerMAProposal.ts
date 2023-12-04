import express, { type Application, type RequestHandler } from "express";
import * as proposerController from "../../../../../controllers/proposer";
import * as commonValidation from "../../../../../utility/validations/common";

const proposerMAProposalRouter: Application = express();

proposerMAProposalRouter.get("/", [
    commonValidation.getAllValidation,
    proposerController.getProposals,
] as RequestHandler[]);

proposerMAProposalRouter.get("/:proposerId", [
    commonValidation.getProposalValidation,
    proposerController.getOtherProposal,
] as RequestHandler[]);

export default proposerMAProposalRouter;
