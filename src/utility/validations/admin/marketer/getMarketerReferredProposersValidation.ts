import { checkExact, checkSchema } from "express-validator";

export const getMarketerReferredProposersValidation = checkExact(
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
        marketerId: {
            exists: {
                errorMessage: "marketerId query parameter is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "marketerId should be string",
                bail: true,
            },
            custom: {
                options: (marketerId) => {
                    const id: number | undefined =
                        Number(marketerId) > 0 ? Number(marketerId) : undefined;

                    if (id == null) {
                        throw new Error("Invalid marketerId");
                    } else {
                        return true;
                    }
                },
            },
        },
    }),
);
