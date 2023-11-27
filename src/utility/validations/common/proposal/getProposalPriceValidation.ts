import { checkExact, checkSchema } from "express-validator";

export const getProposalPriceValidation = checkExact(checkSchema({}));
