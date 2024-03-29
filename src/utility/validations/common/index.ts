import { loginValidation } from "./authentication/loginValidation";
import { withoutAnyArgsValidation } from "./withoutAnyArg/withoutAnyArgsValidation";
import { getProposalValidation } from "./proposal/getProposalValidation";
import { changePasswordValidation } from "./profile/changePasswordValidation";
import { forgotPasswordValidation } from "./authentication/forgotPasswordValidation";
import { getAllValidation } from "./pagination/getAllValidation";
import { emailVerifyValidation } from "./authentication/emailVerifyValidation";
import { regenerateEmailVerifyValidation } from "./authentication/regenerateEmailVerifyValidation";

export {
    loginValidation,
    getProposalValidation,
    withoutAnyArgsValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    getAllValidation,
    emailVerifyValidation,
    regenerateEmailVerifyValidation,
};
