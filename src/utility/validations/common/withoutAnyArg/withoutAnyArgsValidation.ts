import { checkExact, checkSchema } from "express-validator";

export const withoutAnyArgsValidation = checkExact(checkSchema({}));
