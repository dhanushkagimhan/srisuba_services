import { ProposerStatus } from "@prisma/client";
import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const emailVerifyValidation = checkExact(
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
        code: {
            exists: { errorMessage: "code is required" },
            isString: { errorMessage: "code should be string" },
            isLength: {
                options: { min: 6, max: 6 },
                errorMessage: "code should be 6 characters",
            },
        },
    }),
);
