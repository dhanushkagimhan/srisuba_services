import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import { AMarketerStatus } from "@prisma/client";
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

export const marketerEmailVerify = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const responseData: ApiResponse = {
                success: false,
                message: "validation failed",
                errors: errors.array(),
            };
            return res.status(400).send(responseData);
        }

        const payload: RequestPayload = req.body;

        console.log("{marketerEmailVerify} payload : ", payload);

        const marketerData = await prisma.affiliateMarketer.findUnique({
            where: {
                email: payload.email,
            },
            select: {
                status: true,
                emailVerify: {
                    select: {
                        code: true,
                        expirationTime: true,
                    },
                },
            },
        });

        console.log("{marketerEmailVerify} proposer data : ", marketerData);

        const codeExpirationTime = marketerData?.emailVerify?.expirationTime;
        const verifyCode = marketerData?.emailVerify?.code;

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

        const marketerUpdate = await prisma.affiliateMarketer.update({
            where: {
                email: payload.email,
            },
            data: {
                status: AMarketerStatus.EmailVerified,
            },
            select: {
                id: true,
                status: true,
            },
        });

        console.log("proposer update {marketerEmailVerify} : ", marketerUpdate);

        const pAccessToken = proposerAccessTokenGenerate(
            Role.Marketer,
            payload.email,
            marketerUpdate.id,
        );

        const responseData: ApiResponse = {
            success: true,
            data: {
                accessToken: pAccessToken,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {marketerEmailVerify} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
