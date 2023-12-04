import { marketerEmailVerifyValidation } from "./authentication/marketerEmailVerifyValidation";
import { marketerRegenerateEmailVerifyValidation } from "./authentication/marketerRegenerateEmailVerifyValidation";
import { marketerRegisterValidation } from "./authentication/marketerRegisterValidation";
import { marketerResetPasswordValidation } from "./authentication/marketerResetPasswordValidation";
import { createOrUpdateBankAccountValidation } from "./bankAccount/createOrUpdateBankAccountValidation";
import { createAffiliateCodeValidation } from "./marketing/createAffiliateCodeValidation";

export {
    marketerRegisterValidation,
    marketerRegenerateEmailVerifyValidation,
    marketerEmailVerifyValidation,
    marketerResetPasswordValidation,
    createAffiliateCodeValidation,
    createOrUpdateBankAccountValidation,
};
