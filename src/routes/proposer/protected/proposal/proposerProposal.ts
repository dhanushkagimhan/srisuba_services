import express, { type Application, type RequestHandler } from "express";
import * as proposerController from "../../../../controllers/proposer";
import * as proposerValidation from "../../../../utility/validations/proposer";
import * as commonValidation from "../../../../utility/validations/common";

const proposerProposalRouter: Application = express();

proposerProposalRouter.post("/", [
    proposerValidation.createOrUpdateProposalValidation,
    proposerController.createOrUpdateProposal,
] as RequestHandler[]);

proposerProposalRouter.get("/block-reason", [
    proposerValidation.getBlockReasonValidation,
    proposerController.getBlockReason,
] as RequestHandler[]);

proposerProposalRouter.get("/my", [
    commonValidation.withoutAnyArgsValidation,
    proposerController.getMyProposal,
] as RequestHandler[]);

export default proposerProposalRouter;
