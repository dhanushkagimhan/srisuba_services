import { checkExact, checkSchema } from "express-validator";

export const marketerEditProfileValidation = checkExact(
    checkSchema({
        firstName: {
            exists: {
                errorMessage: "firstName is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "firstName should be string" },
        },
        lastName: {
            exists: {
                errorMessage: "lastName is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "lastName should be string" },
        },
        country: {
            exists: {
                errorMessage: "country is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "country should be string" },
        },
    }),
);
