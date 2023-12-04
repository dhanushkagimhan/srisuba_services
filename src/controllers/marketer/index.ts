import { marketerEmailVerify } from "./authentication/marketerEmailVerify";
import { marketerForgotPassword } from "./authentication/marketerForgotPassword";
import { marketerLogin } from "./authentication/marketerLogin";
import { marketerRegenerateEmailVerify } from "./authentication/marketerRegenerateEmailVerify";
import { marketerRegister } from "./authentication/marketerRegister";
import { marketerResetPassword } from "./authentication/marketerResetPassword";
import { createAffiliateCode } from "./marketing/createAffiliateCode";

export {
    marketerRegister,
    marketerRegenerateEmailVerify,
    marketerEmailVerify,
    marketerForgotPassword,
    marketerLogin,
    marketerResetPassword,
    createAffiliateCode,
};
