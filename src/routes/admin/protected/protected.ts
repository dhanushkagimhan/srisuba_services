import express, {
    type Request,
    type Application,
    type Response,
    type NextFunction,
    type RequestHandler,
} from "express";
import { auth } from "../../../middlewares/auth";
import { Role } from "../../../utility/types";
import * as adminController from "../../../controllers/admin";

const protectedRouter: Application = express();

protectedRouter.use((req: Request, res: Response, next: NextFunction) =>
    auth(req, res, next, Role.Admin),
);

protectedRouter.get(
    "/proposals",
    adminController.getProposals as RequestHandler,
);

export default protectedRouter;
