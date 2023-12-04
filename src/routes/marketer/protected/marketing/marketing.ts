import express, { type Application, type RequestHandler } from "express";
import * as marketerController from "../../../../controllers/marketer";
import * as marketerValidation from "../../../../utility/validations/marketer";
import * as commonValidation from "../../../../utility/validations/common";

const marketingRouter: Application = express();

marketingRouter.post("/create-affiliate-code", [
    marketerValidation.createAffiliateCodeValidation,
    marketerController.createAffiliateCode,
] as RequestHandler[]);

marketingRouter.get("/affiliated-proposers", [
    commonValidation.getAllValidation,
    marketerController.getAffiliatedProposers,
] as RequestHandler[]);

export default marketingRouter;
