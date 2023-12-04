import express, { type Application, type RequestHandler } from "express";
import * as proposerController from "../../../../controllers/proposer";
import * as proposerValidation from "../../../../utility/validations/proposer";
import * as commonValidation from "../../../../utility/validations/common";

const proposerProfileRouter: Application = express();

proposerProfileRouter.put("/", [
    proposerValidation.editProfileValidation,
    proposerController.editProfile,
] as RequestHandler[]);

proposerProfileRouter.post("/change-password", [
    commonValidation.changePasswordValidation,
    proposerController.changePassword,
] as RequestHandler[]);

export default proposerProfileRouter;
