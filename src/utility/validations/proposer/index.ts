import { emailVerifyValidation } from "./authentication/emailVerifyValidation";
import { regenerateEmailVerifyValidation } from "./authentication/regenerateEmailVerifyValidation";
import { registerValidation } from "./authentication/registerValidation";
import { forgotPasswordValidation } from "./authentication/forgotPasswordValidation";
import { resetPasswordValidation } from "./authentication/resetPasswordValidation";
import { loginValidation } from "./authentication/loginValidation";
import { createProposalValidation } from "./proposal/createProposalValidation";

export {
    registerValidation,
    emailVerifyValidation,
    regenerateEmailVerifyValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    loginValidation,
    createProposalValidation,
};
