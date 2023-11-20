import express, {
    type Request,
    type Application,
    type Response,
    type NextFunction,
    type RequestHandler,
} from "express";
import { auth } from "../../../middlewares/auth";
import { Role } from "../../../utility/types";
import * as proposerController from "../../../controllers/proposer";
import * as proposerValidation from "../../../utility/validations/proposer";

const protectedRouter: Application = express();

protectedRouter.use((req: Request, res: Response, next: NextFunction) =>
    auth(req, res, next, Role.Proposer),
);

protectedRouter.post("/proposal", [
    proposerValidation.createProposalValidation,
    proposerController.createProposal,
] as RequestHandler[]);

export default protectedRouter;
