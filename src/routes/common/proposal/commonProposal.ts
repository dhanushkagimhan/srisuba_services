import express, { type RequestHandler, type Application } from "express";
import * as commonController from "../../../controllers/common";

const commonProposalRouter: Application = express();

commonProposalRouter.get(
    "/price",
    commonController.getProposalPrice as RequestHandler,
);

export default commonProposalRouter;
