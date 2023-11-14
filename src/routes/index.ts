import express, { type Application } from "express";
import * as proposerController from "../controllers/proposer";

const router: Application = express();

// proposer routes

router.post("/register", proposerController.register);

// marketer routes

// admin routes

export default router;
