import express, { type Application } from "express";
import commonProposalRouter from "./proposal/commonProposal";

const commonRouter: Application = express();

commonRouter.use("/proposal", commonProposalRouter);

export default commonRouter;
