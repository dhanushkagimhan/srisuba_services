import express, { type RequestHandler, type Application } from "express";
import * as proposerController from "../../controllers/proposer";
import * as proposerValidation from "../../utility/validations/proposer";

const proposerRouter: Application = express();

proposerRouter.post("/register", [
    proposerValidation.registerValidation,
    proposerController.register,
] as RequestHandler[]);

proposerRouter.post("/email-verify", [
    proposerValidation.emailVerifyValidation,
    proposerController.emailVerify,
] as RequestHandler[]);

proposerRouter.post("/regen-email-verify-code", [
    proposerValidation.reGenerateEmailVerificationCodeValidation,
    proposerController.reGenerateEmailVerificationCode,
] as RequestHandler[]);

proposerRouter.post("/forgot-password", [
    proposerValidation.forgotPasswordValidation,
    proposerController.forgotPassword,
] as RequestHandler[]);

export default proposerRouter;
