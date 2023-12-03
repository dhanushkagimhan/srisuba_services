import express, { type Application } from "express";
import proposerRouter from "./proposer/proposer";
import adminRouter from "./admin/admin";
import commonRouter from "./common/common";
import marketerRouter from "./marketer/marketer";

const router: Application = express();

router.use("/proposer", proposerRouter);

router.use("/admin", adminRouter);

router.use("/marketer", marketerRouter);

router.use("/c", commonRouter);

export default router;
