import express, { type Application, type RequestHandler } from "express";
import * as marketerController from "../../../../controllers/marketer";
import * as marketerValidation from "../../../../utility/validations/marketer";
// import * as commonValidation from "../../../../utility/validations/common";

const marketerProfileRouter: Application = express();

marketerProfileRouter.put("/", [
    marketerValidation.marketerEditProfileValidation,
    marketerController.marketerEditProfile,
] as RequestHandler[]);

export default marketerProfileRouter;
