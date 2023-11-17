import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import emailVerificationCode from "../../../utility/commonMethods/emailVerificationCode";
import emailTransporter from "../../../utility/emailSender/emailTransporter";

type RequestPayload = {
    email: string;
    code: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const reGenerateEmailVerificationCode = async (
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

            return res.status(400).json(responseData);
        }

        console.log(
            "{proposer-regenerate-email-email-verification-code} payload : ",
            payload,
        );

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
                    update: {
                        data: {
                            code: hashEmailVerification,
                            expirationTime: emailVerificationCodeExpireTime,
                        },
                    },
                },
            },
            select: {
                emailVerify: true,
            },
        });

        console.log(
            "proposer email verify update {proposer-reGenerateEmailVerificationCode} : ",
            emailVerificationUpdate,
        );

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: payload.email,
            subject: "Srisuba - Email verification",
            text: `your email verification code : ${emailVerifyCode}`,
        };

        emailTransporter.sendMail(mailOptions, function (error, info) {
            if (error != null) {
                console.log(error);
            } else {
                console.log(
                    "{proposer-reGenerateEmailVerificationCode} verification Email sent: " +
                        info.response,
                );
            }
        });

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {proposer-reGenerateEmailVerificationCode} : ${error}`,
        );

        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
