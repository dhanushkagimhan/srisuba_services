import express, { type Application, type RequestHandler } from "express";
import * as proposerController from "../../../../../controllers/proposer";
import * as proposerValidation from "../../../../../utility/validations/proposer";

const proposerMAProposalRouter: Application = express();

proposerMAProposalRouter.get("/", [
    proposerValidation.getProposalsValidation,
    proposerController.getProposals,
] as RequestHandler[]);

export default proposerMAProposalRouter;
