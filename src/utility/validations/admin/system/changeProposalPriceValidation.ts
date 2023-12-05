import { checkExact, checkSchema } from "express-validator";

export const changeProposalPriceValidation = checkExact(
    checkSchema({
        price: {
            exists: {
                errorMessage: "price is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isNumeric: {
                errorMessage: "price should be number",
                options: { no_symbols: true },
                bail: true,
            },
            custom: {
                options: (price) => {
                    if (!Number.isInteger(price)) {
                        throw new Error("price should be type number");
                    }

                    return true;
                },
            },
        },
    }),
);
