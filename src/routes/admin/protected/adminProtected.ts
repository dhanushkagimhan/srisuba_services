import express, {
    type Request,
    type Application,
    type Response,
    type NextFunction,
} from "express";
import { auth } from "../../../middlewares/auth";
import { Role } from "../../../utility/types";
import adminProposalRouter from "./proposal/adminProposal";

const adminProtectedRouter: Application = express();

adminProtectedRouter.use((req: Request, res: Response, next: NextFunction) =>
    auth(req, res, next, Role.Admin),
);

adminProtectedRouter.use("/proposal", adminProposalRouter);

export default adminProtectedRouter;
