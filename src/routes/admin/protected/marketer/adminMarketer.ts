import express, { type Application, type RequestHandler } from "express";
import * as adminController from "../../../../controllers/admin";
import * as adminValidation from "../../../../utility/validations/admin";

const adminMarketerRouter: Application = express();

adminMarketerRouter.get("/", [
    adminValidation.getAllMarketersValidation,
    adminController.getAllMarketers,
] as RequestHandler[]);

adminMarketerRouter.get("/proposers/:marketerId", [
    adminValidation.getMarketerReferredProposersValidation,
    adminController.getMarketerReferredProposers,
] as RequestHandler[]);

export default adminMarketerRouter;
