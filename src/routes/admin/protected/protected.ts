import express, {
    type Request,
    type Application,
    type Response,
    type NextFunction,
} from "express";
import { auth } from "../../../middlewares/auth";
import { Role } from "../../../utility/types";
import proposalRouter from "./proposal/proposal";

const protectedRouter: Application = express();

protectedRouter.use((req: Request, res: Response, next: NextFunction) =>
    auth(req, res, next, Role.Admin),
);

protectedRouter.use("/proposal", proposalRouter);

export default protectedRouter;
