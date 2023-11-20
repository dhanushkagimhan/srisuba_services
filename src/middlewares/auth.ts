import { type Request, type Response, type NextFunction } from "express";
import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";

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

        console.log("eeeeeeeeeeeeeeeeeee ", decoded);
        // (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        console.log("Access token auth error : ", err);

        const response: ApiResponse = {
            success: false,
            message: "Please authenticate",
        };
        return res.status(401).send(response);
    }
};
