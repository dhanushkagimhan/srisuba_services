import { checkExact, checkSchema } from "express-validator";

export const getOnlyWithMarketerIdValidation = checkExact(
    checkSchema({
        marketerId: {
            exists: {
                errorMessage: "marketerId query parameter is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "marketerId should be string",
                bail: true,
            },
            custom: {
                options: (marketerId) => {
                    const id: number | undefined =
                        Number(marketerId) > 0 ? Number(marketerId) : undefined;

                    if (id == null) {
                        throw new Error("Invalid marketerId");
                    } else {
                        return true;
                    }
                },
            },
        },
    }),
);
