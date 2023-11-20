import { checkExact, checkSchema } from "express-validator";

export const createProposalValidation = checkExact(
    checkSchema({
        profilePhoto: {
            exists: {
                errorMessage: "profilePhoto is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "profilePhoto should be string",
                bail: true,
            },
        },
    }),
);
