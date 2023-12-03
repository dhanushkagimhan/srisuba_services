import { checkExact, checkSchema } from "express-validator";

export const changePasswordValidation = checkExact(
    checkSchema({
        currentPassword: {
            exists: {
                errorMessage: "currentPassword is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "currentPassword should be string",
                bail: true,
            },
            isLength: {
                options: { min: 8 },
                errorMessage: "currentPassword should be at least 8 characters",
            },
        },
        newPassword: {
            exists: {
                errorMessage: "newPassword is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "newPassword should be string",
                bail: true,
            },
            isLength: {
                options: { min: 8 },
                errorMessage: "newPassword should be at least 8 characters",
            },
        },
    }),
);
