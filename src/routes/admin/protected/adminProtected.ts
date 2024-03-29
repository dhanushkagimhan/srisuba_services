import express, {
    type Request,
    type Application,
    type Response,
    type NextFunction,
} from "express";
import { auth } from "../../../middlewares/auth";
import { Role } from "../../../utility/types";
import adminProposalRouter from "./proposal/adminProposal";
import adminMarketerRouter from "./marketer/adminMarketer";
import systemRouter from "./system/system";

const adminProtectedRouter: Application = express();

adminProtectedRouter.use((req: Request, res: Response, next: NextFunction) =>
    auth(req, res, next, Role.Admin),
);

adminProtectedRouter.use("/proposal", adminProposalRouter);

adminProtectedRouter.use("/marketer", adminMarketerRouter);

adminProtectedRouter.use("/system", systemRouter);

export default adminProtectedRouter;
