import express, { type Application, type RequestHandler } from "express";
import * as marketerController from "../../../../controllers/marketer";
import * as marketerValidation from "../../../../utility/validations/marketer";
import * as commonValidation from "../../../../utility/validations/common";

const bankAccountRouter: Application = express();

bankAccountRouter.post("/", [
    marketerValidation.createOrUpdateBankAccountValidation,
    marketerController.createOrUpdateBankAccount,
] as RequestHandler[]);

bankAccountRouter.get("/", [
    commonValidation.withoutAnyArgsValidation,
    marketerController.getBankAccount,
] as RequestHandler[]);

export default bankAccountRouter;
