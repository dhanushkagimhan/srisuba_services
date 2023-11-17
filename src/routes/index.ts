import express, { type Application } from "express";
import proposerRouter from "./proposer/proposer";

const router: Application = express();

router.use("/proposer", proposerRouter);

export default router;
