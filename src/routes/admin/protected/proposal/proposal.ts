import express, { type Application, type RequestHandler } from "express";
import * as adminController from "../../../../controllers/admin";

const proposalRouter: Application = express();

proposalRouter.get("/", adminController.getProposals as RequestHandler);

export default proposalRouter;
