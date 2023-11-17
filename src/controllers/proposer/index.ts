import { emailVerify } from "./authentication/emailVerify";
import { reGenerateEmailVerificationCode } from "./authentication/reGenerateEmailVerificationCode";
import { register } from "./authentication/register";
import { resetForgotPassword } from "./authentication/resetForgotPassword";

export {
    register,
    emailVerify,
    reGenerateEmailVerificationCode,
    resetForgotPassword,
};
