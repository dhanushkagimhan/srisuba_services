import express, { type Application, type RequestHandler } from "express";
import * as proposerController from "../../../../controllers/proposer";
import * as proposerValidation from "../../../../utility/validations/proposer";

const proposerProfileRouter: Application = express();

proposerProfileRouter.put("/edit", [
    proposerValidation.editProfileValidation,
    proposerController.editProfile,
] as RequestHandler[]);

export default proposerProfileRouter;
