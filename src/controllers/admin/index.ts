import { loginVerify } from "./authentication/loginVerify";
import { login } from "./authentication/login";
import { getAllProposals } from "./proposal/getAllProposals";
import { getProposal } from "./proposal/getProposal";
import { approveProposerPayment } from "./proposal/approveProposerPayment";
import { changeProposerStatus } from "./proposal/changeProposerStatus";

export {
    login,
    loginVerify,
    getAllProposals,
    getProposal,
    approveProposerPayment,
    changeProposerStatus,
};
