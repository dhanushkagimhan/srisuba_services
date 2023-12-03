import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const marketerForgotPasswordValidation = checkExact(
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
    }),
);
