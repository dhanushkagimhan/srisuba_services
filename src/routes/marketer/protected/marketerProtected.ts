import express, {
    type Request,
    type Application,
    type Response,
    type NextFunction,
} from "express";
import { auth } from "../../../middlewares/auth";
import { Role } from "../../../utility/types";
import marketingRouter from "./marketing/marketing";
import bankAccountRouter from "./bankAccount/marketing";
import earningsRouter from "./earning/earnings";

const marketerProtectedRouter: Application = express();

marketerProtectedRouter.use((req: Request, res: Response, next: NextFunction) =>
    auth(req, res, next, Role.Marketer),
);

marketerProtectedRouter.use("/marketing", marketingRouter);

marketerProtectedRouter.use("/bank-acc", bankAccountRouter);

marketerProtectedRouter.use("/earnings", earningsRouter);

export default marketerProtectedRouter;
