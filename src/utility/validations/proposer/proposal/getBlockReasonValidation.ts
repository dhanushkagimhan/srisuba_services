import { checkExact, checkSchema } from "express-validator";

export const getBlockReasonValidation = checkExact(checkSchema({}));
