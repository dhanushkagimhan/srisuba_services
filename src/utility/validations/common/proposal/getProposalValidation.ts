import { checkExact, checkSchema } from "express-validator";

export const getProposalValidation = checkExact(
    checkSchema({
        proposerId: {
            exists: {
                errorMessage: "proposerId query parameter is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "proposerId should be string",
                bail: true,
            },
            custom: {
                options: (proposerId) => {
                    const id: number | undefined =
                        Number(proposerId) > 0 ? Number(proposerId) : undefined;

                    if (id == null) {
                        throw new Error("Invalid proposerId");
                    } else {
                        return true;
                    }
                },
            },
        },
    }),
);
