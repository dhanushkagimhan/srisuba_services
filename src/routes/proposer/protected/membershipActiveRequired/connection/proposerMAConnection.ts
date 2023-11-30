import express, { type Application, type RequestHandler } from "express";
import * as proposerController from "../../../../../controllers/proposer";
import * as proposerValidation from "../../../../../utility/validations/proposer";

const proposerMAConnectionRouter: Application = express();

proposerMAConnectionRouter.post("/send-request", [
    proposerValidation.proposerIdPostMAValidation,
    proposerController.sendRequest,
] as RequestHandler[]);

export default proposerMAConnectionRouter;
