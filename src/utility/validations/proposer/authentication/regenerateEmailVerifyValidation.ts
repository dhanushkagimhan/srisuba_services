import { ProposerStatus } from "@prisma/client";
import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const regenerateEmailVerifyValidation = checkExact(
    checkSchema({
        email: {
            exists: {
                errorMessage: "email is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isEmail: { errorMessage: "Please provide valid email" },
        },
    }),
);
