import { checkExact, checkSchema } from "express-validator";

export const withdrawSystemIncomeValidation = checkExact(
    checkSchema({
        amount: {
            exists: {
                errorMessage: "amount is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isNumeric: {
                errorMessage: "amount should be number",
                options: { no_symbols: true },
                bail: true,
            },
            custom: {
                options: (amount) => {
                    if (!Number.isInteger(amount)) {
                        throw new Error("amount should be type number");
                    }

                    if (amount <= 0) {
                        throw new Error("amount should be > 0");
                    }

                    return true;
                },
            },
        },
    }),
);
