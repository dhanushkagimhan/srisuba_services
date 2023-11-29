import express, {
    type Request,
    type Application,
    type Response,
    type NextFunction,
} from "express";
import { auth } from "../../../middlewares/auth";
import { Role } from "../../../utility/types";
import proposerProposalRouter from "./proposal/proposerProposal";
import membershipActiveRouter from "./membershipActiveRequired/membershipActive";

const proposerProtectedRouter: Application = express();

proposerProtectedRouter.use((req: Request, res: Response, next: NextFunction) =>
    auth(req, res, next, Role.Proposer),
);

proposerProtectedRouter.use("/proposal", proposerProposalRouter);

proposerProtectedRouter.use("/m", membershipActiveRouter);

export default proposerProtectedRouter;
