import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import proposerAccessTokenGenerate from "../../../utility/commonMethods/accessTokenGenerator";
import { Role } from "../../../utility/types";

type RequestPayload = {
    email: string;
    code: string;
};

type ApiResponse = {
    success: boolean;
    data?: {
        accessToken: string;
    };
    message?: string;
    errors?: ValidationError[];
};

export const loginVerify = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const payload: RequestPayload = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const responseData: ApiResponse = {
                success: false,
                message: "validation failed",
                errors: errors.array(),
            };
            return res.status(400).send(responseData);
        }

        console.log("{admin-loginVerify} payload : ", payload);

        const adminData = await prisma.system.findUnique({
            where: {
                adminEmail: payload.email,
            },
            select: {
                adminEmailVerify: {
                    select: {
                        code: true,
                        expirationTime: true,
                    },
                },
            },
        });

        console.log("{admin-loginVerify} proposer data : ", adminData);

        const codeExpirationTime = adminData?.adminEmailVerify?.expirationTime;
        const verifyCode = adminData?.adminEmailVerify?.code;

        if (codeExpirationTime == null || verifyCode == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Not found email verification data",
            };
            return res.status(404).send(responseData);
        }

        const nowTime = new Date();

        if (nowTime > codeExpirationTime) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email verification code expired",
            };
            return res.status(410).send(responseData);
        }

        const isMatch: boolean = bcrypt.compareSync(payload.code, verifyCode);

        if (!isMatch) {
            const responseData: ApiResponse = {
                success: false,
                message: "Invalid Email verification code",
            };
            return res.status(401).send(responseData);
        }

        const pAccessToken = proposerAccessTokenGenerate(
            Role.Admin,
            payload.email,
        );

        const responseData: ApiResponse = {
            success: true,
            data: {
                accessToken: pAccessToken,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {admin-loginVerify} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
