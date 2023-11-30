import express, { type Application, type RequestHandler } from "express";
import { membershipActiveChecker } from "../../../../middlewares/proposer/membershipActiveChecker";
import proposerMAProposalRouter from "./proposal/proposerMAProposal";
import proposerMAConnectionRouter from "./connection/proposerMAConnection";

const membershipActiveRouter: Application = express();

membershipActiveRouter.use(membershipActiveChecker as RequestHandler);

membershipActiveRouter.use("/proposal", proposerMAProposalRouter);

membershipActiveRouter.use("/connection", proposerMAConnectionRouter);

export default membershipActiveRouter;
