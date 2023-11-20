import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const forgotPasswordValidation = checkExact(
    checkSchema({
        email: {
            exists: { errorMessage: "email is required", bail: true },
            isEmail: { errorMessage: "Please provide valid email", bail: true },
            custom: {
                options: async (pEmail: string) => {
                    const exists = await prisma.proposer.count({
                        where: {
                            email: pEmail,
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