import { ProposerStatus } from "@prisma/client";
import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const emailVerifyValidation = checkExact(
    checkSchema({
        email: {
            exists: {
                errorMessage: "email is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isEmail: { errorMessage: "Please provide valid email" },
        },
        code: {
            exists: {
                errorMessage: "code is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "code should be string", bail: true },
            isLength: {
                options: { min: 6, max: 6 },
                errorMessage: "code should be 6 characters",
            },
        },
    }),
);
