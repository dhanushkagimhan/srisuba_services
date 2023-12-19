import express, { type RequestHandler, type Application } from "express";
import * as proposerController from "../../controllers/proposer";
import * as proposerValidation from "../../utility/validations/proposer";
import * as commonValidation from "../../utility/validations/common";
import proposerProtectedRouter from "./protected/proposerProtected";

const proposerRouter: Application = express();

proposerRouter.post("/register", [
    proposerValidation.registerValidation,
    proposerController.register,
] as RequestHandler[]);

proposerRouter.post("/email-verify", [
    commonValidation.emailVerifyValidation,
    proposerController.emailVerify,
] as RequestHandler[]);

proposerRouter.post("/regen-email-verify", [
    proposerValidation.regenerateEmailVerifyValidation,
    proposerController.regenerateEmailVerify,
] as RequestHandler[]);

proposerRouter.post("/forgot-password", [
    commonValidation.forgotPasswordValidation,
    proposerController.forgotPassword,
] as RequestHandler[]);

proposerRouter.post("/reset-password", [
    proposerValidation.resetPasswordValidation,
    proposerController.resetPassword,
] as RequestHandler[]);

proposerRouter.post("/login", [
    commonValidation.loginValidation,
    proposerController.login,
] as RequestHandler[]);

proposerRouter.use("/p", proposerProtectedRouter);

export default proposerRouter;
