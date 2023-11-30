import { checkExact, checkSchema } from "express-validator";

export const proposerIdPostMAValidation = checkExact(
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
                options: (proposerId) => {
                    if (Number.isInteger(proposerId)) {
                        return true;
                    } else {
                        throw new Error("proposerId should be type number");
                    }
                },
            },
        },
    }),
);
