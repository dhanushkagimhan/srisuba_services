import express, { type Application, type RequestHandler } from "express";
import * as marketerController from "../../../../controllers/marketer";
import * as commonValidation from "../../../../utility/validations/common";

const earningsRouter: Application = express();

earningsRouter.get("/account-balance", [
    commonValidation.withoutAnyArgsValidation,
    marketerController.getAccountBalance,
] as RequestHandler[]);

earningsRouter.get("/withdrawals", [
    commonValidation.withoutAnyArgsValidation,
    marketerController.getWithdrawals,
] as RequestHandler[]);

export default earningsRouter;
