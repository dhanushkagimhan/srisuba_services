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
    data?: {
        email: string;
    };
};

export const forgotPassword = async (
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

        console.log("{proposer-forgotPassword} payload : ", payload);

        const proposer = await prisma.proposer.findUnique({
            where: {
                email: payload.email,
            },
            select: {
                status: true,
            },
        });

        if (proposer == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is not registered",
            };
            return res.status(404).send(responseData);
        }

        const [
            emailVerifyCode,
            hashEmailVerification,
            emailVerificationCodeExpireTime,
        ] = await emailVerificationCode();

        const forgotPasswordCreate = await prisma.proposer.update({
            where: {
                email: payload.email,
            },

            data: {
                forgotPassword: {
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
                forgotPassword: true,
            },
        });

        console.log(
            "proposer email verify update {proposer-forgotPassword} : ",
            forgotPasswordCreate,
        );

        emailSender(
            payload.email,
            "Srisuba - Reset forgotten password",
            `your reset password verification code : ${emailVerifyCode}`,
        );

        const responseData: ApiResponse = {
            success: true,
            data: {
                email: payload.email,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer-forgotPassword} : ${error}`);

        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
