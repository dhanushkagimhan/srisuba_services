import express, { type RequestHandler, type Application } from "express";
import * as marketerController from "../../controllers/marketer";
import * as marketerValidation from "../../utility/validations/marketer";
// import * as commonValidation from "../../utility/validations/common";

const marketerRouter: Application = express();

marketerRouter.post("/register", [
    marketerValidation.marketerRegisterValidation,
    marketerController.marketerRegister,
] as RequestHandler[]);

// proposerRouter.post("/email-verify", [
//     proposerValidation.emailVerifyValidation,
//     proposerController.emailVerify,
// ] as RequestHandler[]);

// proposerRouter.post("/regen-email-verify", [
//     proposerValidation.regenerateEmailVerifyValidation,
//     proposerController.regenerateEmailVerify,
// ] as RequestHandler[]);

// proposerRouter.post("/forgot-password", [
//     proposerValidation.forgotPasswordValidation,
//     proposerController.forgotPassword,
// ] as RequestHandler[]);

// proposerRouter.post("/reset-password", [
//     proposerValidation.resetPasswordValidation,
//     proposerController.resetPassword,
// ] as RequestHandler[]);

// proposerRouter.post("/login", [
//     commonValidation.loginValidation,
//     proposerController.login,
// ] as RequestHandler[]);

// proposerRouter.use("/p", proposerProtectedRouter);

export default marketerRouter;
