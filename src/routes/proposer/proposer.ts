import express, { type RequestHandler, type Application } from "express";
import * as proposerController from "../../controllers/proposer";
import * as proposerValidation from "../../utility/validations/proposer";
import protectedRouter from "./protected/protected";

const proposerRouter: Application = express();

proposerRouter.post("/register", [
    proposerValidation.registerValidation,
    proposerController.register,
] as RequestHandler[]);

proposerRouter.post("/email-verify", [
    proposerValidation.emailVerifyValidation,
    proposerController.emailVerify,
] as RequestHandler[]);

proposerRouter.post("/regen-email-verify", [
    proposerValidation.regenerateEmailVerifyValidation,
    proposerController.regenerateEmailVerify,
] as RequestHandler[]);

proposerRouter.post("/forgot-password", [
    proposerValidation.forgotPasswordValidation,
    proposerController.forgotPassword,
] as RequestHandler[]);

proposerRouter.post("/reset-password", [
    proposerValidation.resetPasswordValidation,
    proposerController.resetPassword,
] as RequestHandler[]);

proposerRouter.post("/login", [
    proposerValidation.loginValidation,
    proposerController.login,
] as RequestHandler[]);

proposerRouter.use("/p", protectedRouter);

export default proposerRouter;
