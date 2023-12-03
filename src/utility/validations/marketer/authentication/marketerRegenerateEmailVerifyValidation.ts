import { AMarketerStatus } from "@prisma/client";
import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const marketerRegenerateEmailVerifyValidation = checkExact(
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
                    const marketer = await prisma.affiliateMarketer.findUnique({
                        where: {
                            email: pEmail,
                        },
                        select: {
                            email: true,
                            status: true,
                        },
                    });

                    if (marketer == null) {
                        throw new Error("Email is not registered");
                    }
                    if (
                        marketer.status !==
                        AMarketerStatus.PendingEmailVerification
                    ) {
                        throw new Error("Email is already verified");
                    }
                },
            },
        },
    }),
);