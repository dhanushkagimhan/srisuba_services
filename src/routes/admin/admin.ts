import express, { type Application, type RequestHandler } from "express";
import * as commonValidation from "../../utility/validations/common";
import * as adminController from "../../controllers/admin";

const adminRouter: Application = express();

adminRouter.post("/login", [
    commonValidation.loginValidation,
    adminController.login,
] as RequestHandler[]);

// proposerRouter.use("/p", protectedRouter);

export default adminRouter;
