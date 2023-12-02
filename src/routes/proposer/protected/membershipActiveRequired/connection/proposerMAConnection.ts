import express, { type Application, type RequestHandler } from "express";
import * as proposerController from "../../../../../controllers/proposer";
import * as proposerValidation from "../../../../../utility/validations/proposer";
import * as commonValidation from "../../../../../utility/validations/common";

const proposerMAConnectionRouter: Application = express();

proposerMAConnectionRouter.post("/send-request", [
    proposerValidation.proposerIdPostMAValidation,
    proposerController.sendRequest,
] as RequestHandler[]);

proposerMAConnectionRouter.get("/received-requests", [
    commonValidation.withoutAnyArgsValidation,
    proposerController.getReceivedRequests,
] as RequestHandler[]);

proposerMAConnectionRouter.get("/sent-requests", [
    commonValidation.withoutAnyArgsValidation,
    proposerController.getSentRequests,
] as RequestHandler[]);

proposerMAConnectionRouter.post("/request-acceptation", [
    proposerValidation.acceptOtRejectRequestValidation,
    proposerController.acceptOrRejectRequest,
] as RequestHandler[]);

proposerMAConnectionRouter.get("/partners", [
    commonValidation.withoutAnyArgsValidation,
    proposerController.getPartners,
] as RequestHandler[]);

export default proposerMAConnectionRouter;
