import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";

type RequestPayload = {
    email: string;
    code: string;
    newPassword: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const marketerResetPassword = async (
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

        console.log("{marketerResetPassword} payload : ", payload);

        const marketerData = await prisma.affiliateMarketer.findUnique({
            where: {
                email: payload.email,
            },
            select: {
                forgotPassword: {
                    select: {
                        code: true,
                        expirationTime: true,
                    },
                },
            },
        });

        console.log("{marketerResetPassword} marketer data : ", marketerData);

        const codeExpirationTime = marketerData?.forgotPassword?.expirationTime;
        const verifyCode = marketerData?.forgotPassword?.code;

        if (codeExpirationTime == null || verifyCode == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Not found forgot password reset data",
            };
            return res.status(404).send(responseData);
        }

        const nowTime = new Date();

        if (nowTime > codeExpirationTime) {
            const responseData: ApiResponse = {
                success: false,
                message: "Password reset code expired, try again.",
            };
            return res.status(410).send(responseData);
        }

        const isMatch: boolean = bcrypt.compareSync(payload.code, verifyCode);

        if (!isMatch) {
            const responseData: ApiResponse = {
                success: false,
                message: "Invalid password reset code",
            };
            return res.status(401).send(responseData);
        }

        const saltRound = 8;
        const hashNewPassword: string = await bcrypt.hash(
            payload.newPassword,
            saltRound,
        );

        const marketerUpdate = await prisma.affiliateMarketer.update({
            where: {
                email: payload.email,
            },
            data: {
                password: hashNewPassword,
            },
            select: {
                id: true,
                email: true,
            },
        });

        console.log(
            "marketer password updated {marketerResetPassword} : ",
            marketerUpdate,
        );

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {marketerResetPassword} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
