import express, {
    type Request,
    type Application,
    type Response,
    type NextFunction,
} from "express";
import { auth } from "../../../middlewares/auth";
import { Role } from "../../../utility/types";
import marketingRouter from "./marketing/marketing";

const marketerProtectedRouter: Application = express();

marketerProtectedRouter.use((req: Request, res: Response, next: NextFunction) =>
    auth(req, res, next, Role.Marketer),
);

marketerProtectedRouter.use("/marketing", marketingRouter);

export default marketerProtectedRouter;
