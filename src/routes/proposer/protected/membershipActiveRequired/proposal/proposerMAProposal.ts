import express, { type Application, type RequestHandler } from "express";
import * as proposerController from "../../../../../controllers/proposer";
import * as proposerValidation from "../../../../../utility/validations/proposer";
import * as commonValidation from "../../../../../utility/validations/common";

const proposerMAProposalRouter: Application = express();

proposerMAProposalRouter.get("/", [
    proposerValidation.getProposalsValidation,
    proposerController.getProposals,
] as RequestHandler[]);

proposerMAProposalRouter.get("/:proposerId", [
    commonValidation.getProposalValidation,
    proposerController.getOtherProposal,
] as RequestHandler[]);

export default proposerMAProposalRouter;
