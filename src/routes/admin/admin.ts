import express, { type Application, type RequestHandler } from "express";
import * as commonValidation from "../../utility/validations/common";
import * as adminValidation from "../../utility/validations/admin";
import * as adminController from "../../controllers/admin";
import adminProtectedRouter from "./protected/adminProtected";

const adminRouter: Application = express();

adminRouter.post("/login", [
    commonValidation.loginValidation,
    adminController.login,
] as RequestHandler[]);

adminRouter.post("/login-verify", [
    adminValidation.loginVerifyValidation,
    adminController.loginVerify,
] as RequestHandler[]);

adminRouter.use("/p", adminProtectedRouter);

export default adminRouter;
