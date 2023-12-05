import { loginVerifyValidation } from "./authentication/loginVerifyValidation";
import { getAllMarketersValidation } from "./marketer/getAllMarketersValidation";
import { getMarketerReferredProposersValidation } from "./marketer/getMarketerReferredProposersValidation";
import { getOnlyWithMarketerIdValidation } from "./marketer/getOnlyWithMarketerIdValidation";
import { withdrawMarketerIncomeValidation } from "./marketer/withdrawMarketerIncomeValidation";
import { approvePaymentValidation } from "./proposal/approvePaymentValidation";
import { changeProposerStatusValidation } from "./proposal/changeProposerStatusValidation";
import { getAllProposalsValidation } from "./proposal/getAllProposalsValidation";
import { renewMembershipValidation } from "./proposal/renewMembershipValidation";

export {
    loginVerifyValidation,
    approvePaymentValidation,
    getAllProposalsValidation,
    changeProposerStatusValidation,
    renewMembershipValidation,
    getAllMarketersValidation,
    getMarketerReferredProposersValidation,
    getOnlyWithMarketerIdValidation,
    withdrawMarketerIncomeValidation,
};
