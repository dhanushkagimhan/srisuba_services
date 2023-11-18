import { emailVerifyValidation } from "./authentication/emailVerifyValidation";
import { reGenerateEmailVerificationCodeValidation } from "./authentication/reGenerateEmailVerificationCodeValidation";
import { registerValidation } from "./authentication/registerValidation";
import { forgotPasswordValidation } from "./authentication/forgotPasswordValidation";

export {
    registerValidation,
    emailVerifyValidation,
    reGenerateEmailVerificationCodeValidation,
    forgotPasswordValidation,
};
