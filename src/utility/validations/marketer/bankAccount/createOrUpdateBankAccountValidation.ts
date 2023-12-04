import { checkExact, checkSchema } from "express-validator";

export const createOrUpdateBankAccountValidation = checkExact(
    checkSchema({
        bankName: {
            exists: {
                errorMessage: "bankName is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "bankName should be string" },
        },
        branch: {
            exists: {
                errorMessage: "branch is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "branch should be string" },
        },
        accountHolderName: {
            exists: {
                errorMessage: "accountHolderName is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "accountHolderName should be string" },
        },
        accountNumber: {
            exists: {
                errorMessage: "accountNumber is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "accountNumber should be string" },
        },
    }),
);
