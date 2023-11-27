import express, { type RequestHandler, type Application } from "express";
import * as commonController from "../../../controllers/common";
import * as commonValidation from "../../../utility/validations/common";

const commonProposalRouter: Application = express();

commonProposalRouter.get("/price", [
    commonValidation.getProposalPriceValidation,
    commonController.getProposalPrice,
] as RequestHandler[]);

export default commonProposalRouter;
