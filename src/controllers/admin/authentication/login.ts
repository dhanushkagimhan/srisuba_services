import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import { type ValidationError, validationResult } from "express-validator";
import emailVerificationCode from "../../../utility/commonMethods/emailVerificationCode";
import { type Prisma } from "@prisma/client";
import emailSender from "../../../utility/commonMethods/emailSender";

type RequestPayload = {
    email: string;
    password: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const login = async (req: Request, res: Response): Promise<Response> => {
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

        const admin = await prisma.system.findUnique({
            where: {
                adminEmail: payload.email,
            },
            select: {
                adminPassword: true,
            },
        });

        console.log("{admin-login} found admin data : ", admin);

        if (admin == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is not found",
            };
            return res.status(404).send(responseData);
        }

        const isMatch: boolean = bcrypt.compareSync(
            payload.password,
            admin.adminPassword,
        );

        if (!isMatch) {
            const responseData: ApiResponse = {
                success: false,
                message: "Password is wrong",
            };
            return res.status(401).send(responseData);
        }

        const [
            emailVerifyCode,
            hashEmailVerification,
            emailVerificationCodeExpireTime,
        ] = await emailVerificationCode();

        const adminEmailVerifyInputData: Prisma.AdminEmailVerifyCreateWithoutSystemInput =
            {
                code: hashEmailVerification,
                expirationTime: emailVerificationCodeExpireTime,
            };

        const adminEmailVerifyData = await prisma.system.update({
            where: {
                adminEmail: payload.email,
            },
            data: {
                adminEmailVerify: {
                    upsert: {
                        create: adminEmailVerifyInputData,
                        update: adminEmailVerifyInputData,
                    },
                },
            },
            select: {
                adminEmailVerify: true,
            },
        });

        console.log(
            "{admin-login} After email verification db stored : ",
            adminEmailVerifyData,
        );

        emailSender(
            payload.email,
            "Srisuba - Admin verification",
            `verification code : ${emailVerifyCode}`,
        );

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {admin-login} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
