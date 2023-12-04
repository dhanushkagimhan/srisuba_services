import { checkExact, checkSchema } from "express-validator";

export const createAffiliateCodeValidation = checkExact(
    checkSchema({
        code: {
            exists: {
                errorMessage: "code is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "code should be string" },
        },
    }),
);
