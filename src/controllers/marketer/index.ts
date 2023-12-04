import { marketerEmailVerify } from "./authentication/marketerEmailVerify";
import { marketerForgotPassword } from "./authentication/marketerForgotPassword";
import { marketerLogin } from "./authentication/marketerLogin";
import { marketerRegenerateEmailVerify } from "./authentication/marketerRegenerateEmailVerify";
import { marketerRegister } from "./authentication/marketerRegister";
import { marketerResetPassword } from "./authentication/marketerResetPassword";
import { createOrUpdateBankAccount } from "./bankAccount/createOrUpdateBankAccount";
import { getBankAccount } from "./bankAccount/getBankAccount";
import { getAccountBalance } from "./earning/getAccountBalance";
import { createAffiliateCode } from "./marketing/createAffiliateCode";
import { getAffiliatedProposers } from "./marketing/getAffiliatedProposers";
import { marketerEditProfile } from "./profile/marketerEditProfile";

export {
    marketerRegister,
    marketerRegenerateEmailVerify,
    marketerEmailVerify,
    marketerForgotPassword,
    marketerLogin,
    marketerResetPassword,
    createAffiliateCode,
    getAffiliatedProposers,
    createOrUpdateBankAccount,
    getBankAccount,
    getAccountBalance,
    marketerEditProfile,
};
