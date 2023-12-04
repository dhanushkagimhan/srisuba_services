import { marketerEmailVerifyValidation } from "./authentication/marketerEmailVerifyValidation";
import { marketerRegenerateEmailVerifyValidation } from "./authentication/marketerRegenerateEmailVerifyValidation";
import { marketerRegisterValidation } from "./authentication/marketerRegisterValidation";
import { marketerResetPasswordValidation } from "./authentication/marketerResetPasswordValidation";
import { createAffiliateCodeValidation } from "./marketing/createAffiliateCodeValidation";

export {
    marketerRegisterValidation,
    marketerRegenerateEmailVerifyValidation,
    marketerEmailVerifyValidation,
    marketerResetPasswordValidation,
    createAffiliateCodeValidation,
};
