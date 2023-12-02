import { MatchingProposalStatus } from "@prisma/client";
import { checkExact, checkSchema } from "express-validator";

export const acceptOtRejectRequestValidation = checkExact(
    checkSchema({
        requestId: {
            exists: {
                errorMessage: "requestId is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isNumeric: {
                errorMessage: "requestId should be number",
                options: { no_symbols: true },
                bail: true,
            },
            custom: {
                options: (proposerId) => {
                    if (Number.isInteger(proposerId)) {
                        return true;
                    } else {
                        throw new Error("requestId should be type number");
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
                        status !== MatchingProposalStatus.Accepted &&
                        status !== MatchingProposalStatus.Rejected
                    ) {
                        throw new Error("status is not valid");
                    } else {
                        return true;
                    }
                },
            },
        },
    }),
);
