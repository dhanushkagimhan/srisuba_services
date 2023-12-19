import { loginValidation } from "./authentication/loginValidation";
import { withoutAnyArgsValidation } from "./withoutAnyArg/withoutAnyArgsValidation";
import { getProposalValidation } from "./proposal/getProposalValidation";
import { changePasswordValidation } from "./profile/changePasswordValidation";
import { forgotPasswordValidation } from "./authentication/forgotPasswordValidation";
import { getAllValidation } from "./pagination/getAllValidation";
import { emailVerifyValidation } from "./authentication/emailVerifyValidation";

export {
    loginValidation,
    getProposalValidation,
    withoutAnyArgsValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    getAllValidation,
    emailVerifyValidation,
};
