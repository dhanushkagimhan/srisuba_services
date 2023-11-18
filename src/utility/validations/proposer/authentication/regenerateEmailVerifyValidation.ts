import { ProposerStatus } from "@prisma/client";
import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const regenerateEmailVerifyValidation = checkExact(
    checkSchema({
        email: {
            isEmail: { bail: true, errorMessage: "Please provide valid email" },
            custom: {
                options: async (pEmail: string) => {
                    const proposer = await prisma.proposer.findUnique({
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
                        ProposerStatus.PendingEmailVerification
                    ) {
                        throw new Error("Email is already verified");
                    }
                },
            },
        },
    }),
);
