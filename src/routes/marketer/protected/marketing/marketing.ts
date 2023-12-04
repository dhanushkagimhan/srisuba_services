import express, { type Application, type RequestHandler } from "express";
import * as marketerController from "../../../../controllers/marketer";
import * as marketerValidation from "../../../../utility/validations/marketer";

const marketingRouter: Application = express();

marketingRouter.post("/create-affiliate-code", [
    marketerValidation.createAffiliateCodeValidation,
    marketerController.createAffiliateCode,
] as RequestHandler[]);

export default marketingRouter;
