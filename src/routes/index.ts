import express, { type Application } from "express";
import proposerRouter from "./proposer/proposer";
import adminRouter from "./admin/admin";

const router: Application = express();

router.use("/proposer", proposerRouter);

router.use("/admin", adminRouter);

export default router;
