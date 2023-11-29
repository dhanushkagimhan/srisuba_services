import { emailVerifyValidation } from "./authentication/emailVerifyValidation";
import { regenerateEmailVerifyValidation } from "./authentication/regenerateEmailVerifyValidation";
import { registerValidation } from "./authentication/registerValidation";
import { forgotPasswordValidation } from "./authentication/forgotPasswordValidation";
import { resetPasswordValidation } from "./authentication/resetPasswordValidation";
import { createProposalValidation } from "./proposal/createProposalValidation";
import { getBlockReasonValidation } from "./proposal/getBlockReasonValidation";
import { getProposalsValidation } from "./proposal/getProposalsValidation";

export {
    registerValidation,
    emailVerifyValidation,
    regenerateEmailVerifyValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    createProposalValidation,
    getBlockReasonValidation,
    getProposalsValidation,
};
