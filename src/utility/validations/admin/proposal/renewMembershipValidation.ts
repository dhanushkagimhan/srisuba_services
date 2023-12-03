import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";
import { ProposerStatus } from "@prisma/client";

export const renewMembershipValidation = checkExact(
    checkSchema({
        proposerId: {
            exists: {
                errorMessage: "proposerId is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isNumeric: {
                errorMessage: "proposerId should be number",
                options: { no_symbols: true },
                bail: true,
            },
            custom: {
                options: async (proposerId) => {
                    if (!Number.isInteger(proposerId)) {
                        throw new Error("proposerId should be type number");
                    }

                    const proposer = await prisma.proposer.findUnique({
                        where: {
                            id: proposerId,
                        },
                        select: {
                            status: true,
                            membershipExpiration: true,
                        },
                    });

                    if (proposer == null) {
                        throw new Error("proposer is not found");
                    }

                    if (
                        proposer.status !== ProposerStatus.Active &&
                        proposer.status !== ProposerStatus.Banned &&
                        proposer.status !== ProposerStatus.Rejected
                    ) {
                        throw new Error(
                            `proposer status is not valid - (current proposer status : ${proposer.status})`,
                        );
                    }

                    if (proposer.membershipExpiration > new Date()) {
                        throw new Error("proposer membership is not expired");
                    }
                },
            },
        },
    }),
);
