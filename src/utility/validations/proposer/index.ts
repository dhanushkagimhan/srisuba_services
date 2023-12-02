import { emailVerifyValidation } from "./authentication/emailVerifyValidation";
import { regenerateEmailVerifyValidation } from "./authentication/regenerateEmailVerifyValidation";
import { registerValidation } from "./authentication/registerValidation";
import { forgotPasswordValidation } from "./authentication/forgotPasswordValidation";
import { resetPasswordValidation } from "./authentication/resetPasswordValidation";
import { createOrUpdateProposalValidation } from "./proposal/createOrUpdateProposalValidation";
import { getBlockReasonValidation } from "./proposal/getBlockReasonValidation";
import { getProposalsValidation } from "./proposal/getProposalsValidation";
import { proposerIdPostMAValidation } from "./connection/proposerIdPostMAValidation";
import { acceptOtRejectRequestValidation } from "./connection/acceptOtRejectRequestValidation";
import { editProfileValidation } from "./profile/editProfileValidation";

export {
    registerValidation,
    emailVerifyValidation,
    regenerateEmailVerifyValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    createOrUpdateProposalValidation,
    getBlockReasonValidation,
    getProposalsValidation,
    proposerIdPostMAValidation,
    acceptOtRejectRequestValidation,
    editProfileValidation,
};
