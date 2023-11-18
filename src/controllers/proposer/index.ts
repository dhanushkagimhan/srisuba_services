import { emailVerify } from "./authentication/emailVerify";
import { reGenerateEmailVerificationCode } from "./authentication/reGenerateEmailVerificationCode";
import { register } from "./authentication/register";
import { forgotPassword } from "./authentication/forgotPassword";

export {
    register,
    emailVerify,
    reGenerateEmailVerificationCode,
    forgotPassword,
};
