import { registerValidation } from "./authentication/registerValidation";
import { resetPasswordValidation } from "./authentication/resetPasswordValidation";
import { createOrUpdateProposalValidation } from "./proposal/createOrUpdateProposalValidation";
import { getBlockReasonValidation } from "./proposal/getBlockReasonValidation";
import { proposerIdPostMAValidation } from "./connection/proposerIdPostMAValidation";
import { acceptOtRejectRequestValidation } from "./connection/acceptOtRejectRequestValidation";
import { editProfileValidation } from "./profile/editProfileValidation";

export {
    registerValidation,
    resetPasswordValidation,
    createOrUpdateProposalValidation,
    getBlockReasonValidation,
    proposerIdPostMAValidation,
    acceptOtRejectRequestValidation,
    editProfileValidation,
};
