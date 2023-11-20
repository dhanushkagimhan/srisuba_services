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

export const forgotPassword = async (
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

        console.log("{proposer-forgotPassword} payload : ", payload);

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
                    "{proposer-forgotPassword} verification Email sent: " +
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
        console.log(`Unexpected Error {proposer-forgotPassword} : ${error}`);

        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};