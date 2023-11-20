import { emailVerify } from "./authentication/emailVerify";
import { regenerateEmailVerify } from "./authentication/regenerateEmailVerify";
import { register } from "./authentication/register";
import { forgotPassword } from "./authentication/forgotPassword";
import { resetPassword } from "./authentication/resetPassword";

export {
    register,
    emailVerify,
    regenerateEmailVerify,
    forgotPassword,
    resetPassword,
};
