import { emailVerify } from "./authentication/emailVerify";
import { regenerateEmailVerify } from "./authentication/regenerateEmailVerify";
import { register } from "./authentication/register";
import { forgotPassword } from "./authentication/forgotPassword";
import { resetPassword } from "./authentication/resetPassword";
import { login } from "./authentication/login";
import { createOrUpdateProposal } from "./proposal/createOrUpdateProposal";
import { getBlockReason } from "./proposal/getBlockReason";
import { getProposals } from "./proposal/getProposals";
import { getMyProposal } from "./proposal/getMyProposal";
import { getOtherProposal } from "./proposal/getOtherProposal";
import { sendRequest } from "./connection/sendRequest";
import { getReceivedRequests } from "./connection/getReceivedRequests";
import { getSentRequests } from "./connection/getSentRequests";
import { acceptOrRejectRequest } from "./connection/acceptOrRejectRequest";

export {
    register,
    emailVerify,
    regenerateEmailVerify,
    forgotPassword,
    resetPassword,
    login,
    createOrUpdateProposal,
    getBlockReason,
    getProposals,
    getMyProposal,
    getOtherProposal,
    sendRequest,
    getReceivedRequests,
    getSentRequests,
    acceptOrRejectRequest,
};
