import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import { type Gender, AMarketerStatus } from "@prisma/client";
import { type ValidationError, validationResult } from "express-validator";
import emailVerificationCode from "../../../utility/commonMethods/emailVerificationCode";
import emailSender from "../../../utility/commonMethods/emailSender";

type RequestPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    country: string;
};

type ApiResponse = {
    success: boolean;
    data?: {
        email: string;
    };
    message?: string;
    errors?: ValidationError[];
};

export const marketerRegister = async (
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

        const saltRound = 8;
        const hashPassword: string = await bcrypt.hash(
            payload.password,
            saltRound,
        );

        const [
            emailVerifyCode,
            hashEmailVerification,
            emailVerificationCodeExpireTime,
        ] = await emailVerificationCode();

        const createMarketer = await prisma.affiliateMarketer.create({
            data: {
                email: payload.email,
                password: hashPassword,
                firstName: payload.firstName,
                lastName: payload.firstName,
                gender: payload.gender,
                country: payload.country,
                status: AMarketerStatus.PendingEmailVerification,
                accountBalance: 0,
                emailVerify: {
                    create: {
                        code: hashEmailVerification,
                        expirationTime: emailVerificationCodeExpireTime,
                    },
                },
            },
        });

        console.log(
            "{proposer-marketerRegister} created marketer : ",
            createMarketer,
        );

        emailSender(
            payload.email,
            "Srisuba - Email verification",
            `your email verification code : ${emailVerifyCode}`,
        );

        const responseData: ApiResponse = {
            success: true,
            data: {
                email: createMarketer.email,
            },
        };

        return res.status(201).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer-marketerRegister} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
