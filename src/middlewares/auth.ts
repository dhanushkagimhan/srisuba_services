import { type Request, type Response, type NextFunction } from "express";
import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";
import { Role } from "../utility/types";

export const SECRET_KEY: Secret =
    process.env.AUTH_SECRET_KEY ?? "fjiocdaECADG$53234498d4af";

type ApiResponse = {
    success: boolean;
    message: string;
};

export const auth = (
    req: Request,
    res: Response,
    next: NextFunction,
    role: Role,
): Response | undefined => {
    try {
        const accessToken = req.header("Authorization")?.replace("Bearer ", "");

        if (accessToken == null) {
            throw new Error("Access token not have in the request header");
        }

        const decoded: JwtPayload | string = jwt.verify(
            accessToken,
            SECRET_KEY,
        );

        console.log("{auth} decoded : ", decoded);

        if (typeof decoded === "string") {
            throw new Error("decoded data is string");
        }

        if (decoded.role !== role) {
            throw new Error(
                `user role is invalid. request token role - ${decoded.role}`,
            );
        }

        if (decoded.id != null) {
            if (decoded.role === Role.Proposer) {
                res.locals.proposerId = decoded.id;
            } else if (decoded.role === Role.Marketer) {
                res.locals.marketerId = decoded.id;
            }
        }

        next();
    } catch (err) {
        console.log("{auth} Access token auth error : ", err);

        const response: ApiResponse = {
            success: false,
            message: "Please authenticate",
        };
        return res.status(401).send(response);
    }
};
