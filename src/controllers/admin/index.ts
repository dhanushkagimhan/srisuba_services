import { loginVerify } from "./authentication/loginVerify";
import { login } from "./authentication/login";
import { getAllProposals } from "./proposal/getAllProposals";
import { getProposal } from "./proposal/getProposal";
import { approveProposerPayment } from "./proposal/approveProposerPayment";
import { changeProposerStatus } from "./proposal/changeProposerStatus";
import { renewMembership } from "./proposal/renewMembership";
import { getAllMarketers } from "./marketer/getAllMarketers";

export {
    login,
    loginVerify,
    getAllProposals,
    getProposal,
    approveProposerPayment,
    changeProposerStatus,
    renewMembership,
    getAllMarketers,
};
