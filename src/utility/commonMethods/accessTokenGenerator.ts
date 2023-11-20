import { SECRET_KEY } from "../../middlewares/auth";
import { Role } from "../types";
import jwt from "jsonwebtoken";

type TokenBody = {
    role: Role;
    email: string;
    id?: number;
};

const proposerAccessTokenGenerate = (
    uRole: Role,
    uEmail: string,
    id?: number,
): string => {
    const tokenBody: TokenBody = { role: uRole, email: uEmail };

    if (uRole !== Role.Admin) {
        tokenBody.id = id;
    }

    const accessToken: string = jwt.sign(tokenBody, SECRET_KEY, {
        expiresIn: "1h",
    });

    return accessToken;
};

export default proposerAccessTokenGenerate;
