import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const marketerResetPasswordValidation = checkExact(
    checkSchema({
        email: {
            exists: {
                errorMessage: "email is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isEmail: { errorMessage: "Please provide valid email", bail: true },
            custom: {
                options: async (mEmail: string) => {
                    const exists = await prisma.affiliateMarketer.count({
                        where: {
                            email: mEmail,
                        },
                    });

                    if (exists === 0) {
                        throw new Error("Email is not registered");
                    }
                },
            },
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
        newPassword: {
            exists: {
                errorMessage: "newPassword is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "newPassword should be string",
                bail: true,
            },
            isLength: {
                options: { min: 8 },
                errorMessage: "newPassword should be at least 8 characters",
            },
        },
    }),
);
