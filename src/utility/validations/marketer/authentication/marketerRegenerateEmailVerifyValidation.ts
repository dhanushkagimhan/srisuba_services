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
                    const proposer = await prisma.affiliateMarketer.findUnique({
                        where: {
                            email: pEmail,
                        },
                        select: {
                            email: true,
                            status: true,
                        },
                    });

                    if (proposer == null) {
                        throw new Error("Email is not registered");
                    }
                    if (
                        proposer.status !==
                        AMarketerStatus.PendingEmailVerification
                    ) {
                        throw new Error("Email is already verified");
                    }
                },
            },
        },
    }),
);
