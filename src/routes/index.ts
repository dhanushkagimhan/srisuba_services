import express, { type RequestHandler, type Application } from "express";
import * as proposerController from "../controllers/proposer";
import * as proposerValidation from "../validations/proposer";

const router: Application = express();

// proposer routes

router.post("/register", [
    proposerValidation.registerValidation,
    proposerController.register,
] as RequestHandler[]);

// marketer routes

// admin routes

export default router;
