import express, { type Application, type RequestHandler } from "express";
import * as proposerController from "../../../../controllers/proposer";
import * as proposerValidation from "../../../../utility/validations/proposer";

const proposerProposalRouter: Application = express();

proposerProposalRouter.post("/", [
    proposerValidation.createProposalValidation,
    proposerController.createProposal,
] as RequestHandler[]);

proposerProposalRouter.get("/block-reason", [
    proposerValidation.getBlockReasonValidation,
    proposerController.getBlockReason,
] as RequestHandler[]);

export default proposerProposalRouter;
