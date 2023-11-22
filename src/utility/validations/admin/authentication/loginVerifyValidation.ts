import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const loginVerifyValidation = checkExact(
    checkSchema({
        email: {
            exists: {
                errorMessage: "email is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isEmail: { errorMessage: "Please provide valid email", bail: true },
            custom: {
                options: async (pEmail: string) => {
                    const admin = await prisma.system.findUnique({
                        where: {
                            adminEmail: pEmail,
                        },
                        select: {
                            adminEmail: true,
                        },
                    });

                    if (admin == null) {
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
    }),
);
