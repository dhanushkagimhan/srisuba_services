import { checkExact, checkSchema } from "express-validator";

export const forgotPasswordValidation = checkExact(
    checkSchema({
        email: {
            exists: {
                errorMessage: "email is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isEmail: { errorMessage: "Please provide valid email" },
        },
    }),
);
