import express, { type RequestHandler, type Application } from "express";
import * as marketerController from "../../controllers/marketer";
import * as marketerValidation from "../../utility/validations/marketer";
import * as commonValidation from "../../utility/validations/common";
import marketerProtectedRouter from "./protected/marketerProtected";

const marketerRouter: Application = express();

marketerRouter.post("/register", [
    marketerValidation.marketerRegisterValidation,
    marketerController.marketerRegister,
] as RequestHandler[]);

marketerRouter.post("/email-verify", [
    commonValidation.emailVerifyValidation,
    marketerController.marketerEmailVerify,
] as RequestHandler[]);

marketerRouter.post("/regen-email-verify", [
    commonValidation.regenerateEmailVerifyValidation,
    marketerController.marketerRegenerateEmailVerify,
] as RequestHandler[]);

marketerRouter.post("/forgot-password", [
    commonValidation.forgotPasswordValidation,
    marketerController.marketerForgotPassword,
] as RequestHandler[]);

marketerRouter.post("/reset-password", [
    marketerValidation.marketerResetPasswordValidation,
    marketerController.marketerResetPassword,
] as RequestHandler[]);

marketerRouter.post("/login", [
    commonValidation.loginValidation,
    marketerController.marketerLogin,
] as RequestHandler[]);

marketerRouter.use("/p", marketerProtectedRouter);

export default marketerRouter;
