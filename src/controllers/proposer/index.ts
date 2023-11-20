import { emailVerify } from "./authentication/emailVerify";
import { regenerateEmailVerify } from "./authentication/regenerateEmailVerify";
import { register } from "./authentication/register";
import { forgotPassword } from "./authentication/forgotPassword";
import { resetPassword } from "./authentication/resetPassword";
import { login } from "./authentication/login";

export {
    register,
    emailVerify,
    regenerateEmailVerify,
    forgotPassword,
    resetPassword,
    login,
};
