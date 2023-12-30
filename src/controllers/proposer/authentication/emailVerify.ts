import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import { ProposerStatus } from "@prisma/client";
import proposerAccessTokenGenerate from "../../../utility/commonMethods/accessTokenGenerator";
import { Role } from "../../../utility/types";

type RequestPayload = {
    email: string;
    code: string;
};

type ApiResponse = {
    success: boolean;
    data?: {
        id: number;
        status: ProposerStatus;
        accessToken: string;
    };
    message?: string;
    errors?: ValidationError[];
};

export const emailVerify = async (
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

        console.log("{proposer-email-verify} payload : ", payload);

        const proposerData = await prisma.proposer.findUnique({
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

        console.log("{proposer-email-verify} proposer data : ", proposerData);

        if (proposerData == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is not registered",
            };
            return res.status(400).send(responseData);
        }
        if (proposerData.status !== ProposerStatus.PendingEmailVerification) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is already verified",
            };
            return res.status(400).send(responseData);
        }

        const codeExpirationTime = proposerData?.emailVerify?.expirationTime;
        const verifyCode = proposerData?.emailVerify?.code;

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

        const proposerUpdate = await prisma.proposer.update({
            where: {
                email: payload.email,
            },
            data: {
                status: ProposerStatus.EmailVerified,
            },
            select: {
                id: true,
                status: true,
            },
        });

        console.log(
            "proposer update {proposer-email-verify} : ",
            proposerUpdate,
        );

        const pAccessToken = proposerAccessTokenGenerate(
            Role.Proposer,
            payload.email,
            proposerUpdate.id,
        );

        const responseData: ApiResponse = {
            success: true,
            data: {
                id: proposerUpdate.id,
                status: proposerUpdate.status,
                accessToken: pAccessToken,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer-email-verify} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
