import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import emailVerificationCode from "../../../utility/commonMethods/emailVerificationCode";
import emailSender from "../../../utility/commonMethods/emailSender";
import { AMarketerStatus } from "@prisma/client";

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

export const marketerForgotPassword = async (
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

        console.log("{marketer-marketerForgotPassword} payload : ", payload);

        const marketer = await prisma.affiliateMarketer.findUnique({
            where: {
                email: payload.email,
            },
            select: {
                status: true,
            },
        });

        if (marketer == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is not registered",
            };
            return res.status(404).send(responseData);
        }

        if (marketer.status === AMarketerStatus.PendingEmailVerification) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is not verified",
            };
            return res.status(403).send(responseData);
        }

        const [
            emailVerifyCode,
            hashEmailVerification,
            emailVerificationCodeExpireTime,
        ] = await emailVerificationCode();

        const forgotPasswordCreate = await prisma.affiliateMarketer.update({
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
            "marketer email verify update {marketer-marketerForgotPassword} : ",
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
        console.log(
            `Unexpected Error {marketer-marketerForgotPassword} : ${error}`,
        );

        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
