import { marketerRegisterValidation } from "./authentication/marketerRegisterValidation";
import { marketerResetPasswordValidation } from "./authentication/marketerResetPasswordValidation";
import { createOrUpdateBankAccountValidation } from "./bankAccount/createOrUpdateBankAccountValidation";
import { createAffiliateCodeValidation } from "./marketing/createAffiliateCodeValidation";
import { marketerEditProfileValidation } from "./profile/marketerEditProfileValidation";

export {
    marketerRegisterValidation,
    marketerResetPasswordValidation,
    createAffiliateCodeValidation,
    createOrUpdateBankAccountValidation,
    marketerEditProfileValidation,
};
