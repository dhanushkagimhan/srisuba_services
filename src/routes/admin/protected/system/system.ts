import express, { type Application, type RequestHandler } from "express";
import * as adminController from "../../../../controllers/admin";
import * as adminValidation from "../../../../utility/validations/admin";
import * as commonValidation from "../../../../utility/validations/common";

const systemRouter: Application = express();

systemRouter.get("/", [
    commonValidation.withoutAnyArgsValidation,
    adminController.getSystemDetails,
] as RequestHandler[]);

systemRouter.post("/withdraw", [
    adminValidation.withdrawSystemIncomeValidation,
    adminController.withdrawSystemIncome,
] as RequestHandler[]);

systemRouter.get("/withdrawals", [
    commonValidation.withoutAnyArgsValidation,
    adminController.getSystemWithdrawals,
] as RequestHandler[]);

systemRouter.patch("/proposal-price", [
    adminValidation.changeProposalPriceValidation,
    adminController.changeProposalPrice,
] as RequestHandler[]);

export default systemRouter;
