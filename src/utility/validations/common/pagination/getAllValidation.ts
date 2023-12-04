import { checkExact, checkSchema } from "express-validator";

export const getAllValidation = checkExact(
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
    }),
);
