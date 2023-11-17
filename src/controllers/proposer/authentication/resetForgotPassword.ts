import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import emailVerificationCode from "../../../utility/commonMethods/emailVerificationCode";
import emailTransporter from "../../../utility/emailSender/emailTransporter";

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

export const resetForgotPassword = async (
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

        console.log("{proposer-resetForgotPassword} payload : ", payload);

        const [
            emailVerifyCode,
            hashEmailVerification,
            emailVerificationCodeExpireTime,
        ] = await emailVerificationCode();

        const forgotPasswordCreate = await prisma.proposerForgotPassword.create(
            {
                data: {
                    code: hashEmailVerification,
                    expirationTime: emailVerificationCodeExpireTime,
                    proposer: {
                        connect: {
                            email: payload.email,
                        },
                    },
                },
            },
        );

        console.log(
            "proposer email verify update {proposer-resetForgotPassword} : ",
            forgotPasswordCreate,
        );

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: payload.email,
            subject: "Srisuba - Reset forgotten password",
            text: `your reset password verification code : ${emailVerifyCode}`,
        };

        emailTransporter.sendMail(mailOptions, function (error, info) {
            if (error != null) {
                console.log(error);
            } else {
                console.log(
                    "{proposer-resetForgotPassword} verification Email sent: " +
                        info.response,
                );
            }
        });

        const responseData: ApiResponse = {
            success: true,
            data: {
                email: payload.email,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {proposer-resetForgotPassword} : ${error}`,
        );

        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
