import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import emailVerificationCode from "../../../utility/commonMethods/emailVerificationCode";
import emailSender from "../../../utility/commonMethods/emailSender";
import { ProposerStatus } from "@prisma/client";

type RequestPayload = {
    email: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const regenerateEmailVerify = async (
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

        console.log("{proposer-regenerateEmailVerify} payload : ", payload);

        const proposer = await prisma.proposer.findUnique({
            where: {
                email: payload.email,
            },
            select: {
                email: true,
                status: true,
            },
        });

        if (proposer == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is not registered",
            };

            return res.status(400).send(responseData);
        }
        if (proposer.status !== ProposerStatus.PendingEmailVerification) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is already verified",
            };

            return res.status(400).send(responseData);
        }

        const [
            emailVerifyCode,
            hashEmailVerification,
            emailVerificationCodeExpireTime,
        ] = await emailVerificationCode();

        const emailVerificationUpdate = await prisma.proposer.update({
            where: {
                email: payload.email,
            },
            data: {
                emailVerify: {
                    upsert: {
                        create: {
                            code: hashEmailVerification,
                            expirationTime: emailVerificationCodeExpireTime,
                        },
                        update: {
                            code: hashEmailVerification,
                            expirationTime: emailVerificationCodeExpireTime,
                        },
                    },
                },
            },
            select: {
                email: true,
                emailVerify: true,
            },
        });

        console.log(
            "proposer email verify update {proposer-regenerateEmailVerify} : ",
            emailVerificationUpdate,
        );

        emailSender(
            payload.email,
            "Srisuba - Email verification",
            `your email verification code : ${emailVerifyCode}`,
        );

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {proposer-regenerateEmailVerify} : ${error}`,
        );

        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
