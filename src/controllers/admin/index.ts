import { loginVerify } from "./authentication/loginVerify";
import { login } from "./authentication/login";
import { getAllProposals } from "./proposal/getAllProposals";
import { getProposal } from "./proposal/getProposal";
import { approveProposerPayment } from "./proposal/approveProposerPayment";
import { changeProposerStatus } from "./proposal/changeProposerStatus";
import { renewMembership } from "./proposal/renewMembership";
import { getAllMarketers } from "./marketer/getAllMarketers";
import { getMarketerReferredProposers } from "./marketer/getMarketerReferredProposers";
import { getMarketerBankAccount } from "./marketer/getMarketerBankAccount";
import { withdrawMarketerIncome } from "./marketer/withdrawMarketerIncome";
import { getMarketerWithdrawals } from "./marketer/getMarketerWithdrawals";
import { getSystemDetails } from "./system/getSystemDetails";
import { withdrawSystemIncome } from "./system/withdrawSystemIncome";
import { getSystemWithdrawals } from "./system/getSystemWithdrawals";
import { changeProposalPrice } from "./system/changeProposalPrice";

export {
    login,
    loginVerify,
    getAllProposals,
    getProposal,
    approveProposerPayment,
    changeProposerStatus,
    renewMembership,
    getAllMarketers,
    getMarketerReferredProposers,
    getMarketerBankAccount,
    withdrawMarketerIncome,
    getMarketerWithdrawals,
    getSystemDetails,
    withdrawSystemIncome,
    getSystemWithdrawals,
    changeProposalPrice,
};
