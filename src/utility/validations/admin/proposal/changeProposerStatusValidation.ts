import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";
import { ProposerStatus } from "@prisma/client";

export const changeProposerStatusValidation = checkExact(
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
                        },
                    });

                    if (proposer == null) {
                        throw new Error("proposer is not found");
                    }

                    if (
                        proposer.status !== ProposerStatus.PaymentApproved &&
                        proposer.status !== ProposerStatus.Active &&
                        proposer.status !== ProposerStatus.Rejected &&
                        proposer.status !== ProposerStatus.RejectionResolved &&
                        proposer.status !== ProposerStatus.Banned
                    ) {
                        throw new Error(
                            `proposer status is not valid - (current proposer status : ${proposer.status})`,
                        );
                    }
                },
            },
        },
        status: {
            exists: {
                errorMessage: "status is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "status should be string",
                bail: true,
            },
            custom: {
                options: (status: string) => {
                    if (
                        status !== ProposerStatus.Active &&
                        status !== ProposerStatus.Rejected &&
                        status !== ProposerStatus.Banned
                    ) {
                        throw new Error("new proposer status is not valid");
                    } else {
                        return true;
                    }
                },
            },
        },
        reason: {
            optional: true,
            isString: {
                errorMessage: "reason should be string",
                bail: true,
            },
            custom: {
                options: (reason: string) => {
                    if (reason.length > 0) {
                        return true;
                    } else {
                        throw new Error("reason length should be > 0");
                    }
                },
            },
        },
    }),
);
