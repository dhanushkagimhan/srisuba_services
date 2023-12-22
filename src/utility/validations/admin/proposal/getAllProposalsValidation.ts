import { checkExact, checkSchema } from "express-validator";

export const getAllProposalsValidation = checkExact(
    checkSchema({
        page: {
            optional: true,
            isNumeric: {
                errorMessage: "page should be number",
                options: { no_symbols: true },
                bail: true,
            },
            custom: {
                options: (page: number) => {
                    if (Number(page) > 0) {
                        return true;
                    } else {
                        throw new Error("page should be number > 0");
                    }
                },
            },
        },
        pageSize: {
            optional: true,
            isNumeric: {
                errorMessage: "pageSize should be number",
                options: { no_symbols: true },
                bail: true,
            },
            custom: {
                options: (page: number) => {
                    if (Number(page) > 0) {
                        return true;
                    } else {
                        throw new Error("pageSize should be number > 0");
                    }
                },
            },
        },
        proposerStatus: {
            optional: true,
            isString: { errorMessage: "proposerStatus should be string" },
        },
        isOnlyExpired: {
            optional: true,
            isBoolean: {
                errorMessage: "isOnlyExpired should be boolean",
            },
        },
        isIncludePayments: {
            optional: true,
            isBoolean: {
                errorMessage: "isIncludePayments should be boolean",
            },
        },
        orderDesc: {
            optional: true,
            isBoolean: {
                errorMessage: "orderDesc should be boolean",
            },
        },
    }),
);
