import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import { AMarketerStatus } from "@prisma/client";
import { type ValidationError, validationResult } from "express-validator";
import proposerAccessTokenGenerate from "../../../utility/commonMethods/accessTokenGenerator";
import { Role } from "../../../utility/types";

type RequestPayload = {
    email: string;
    password: string;
};

type ApiResponse = {
    success: boolean;
    data?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        accessToken?: string;
        status: AMarketerStatus;
        accountBalance: number;
        affiliateCode: string | null;
    };
    message?: string;
    errors?: ValidationError[];
};

export const marketerLogin = async (
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

        console.log("{marketerLogin} payload : ", payload);

        const marketer = await prisma.affiliateMarketer.findUnique({
            where: {
                email: payload.email,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                password: true,
                status: true,
                accountBalance: true,
                affiliateCode: true,
            },
        });

        console.log("{marketerLogin} found marketer data : ", marketer);

        if (marketer == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is not registered",
            };
            return res.status(404).send(responseData);
        }

        const isMatch: boolean = bcrypt.compareSync(
            payload.password,
            marketer.password,
        );

        if (!isMatch) {
            const responseData: ApiResponse = {
                success: false,
                message: "Password is wrong",
            };
            return res.status(401).send(responseData);
        }

        const responseData: ApiResponse = {
            success: true,
            data: {
                id: marketer.id,
                email: payload.email,
                firstName: marketer.firstName,
                lastName: marketer.lastName,
                status: marketer.status,
                accountBalance: marketer.accountBalance,
                affiliateCode: marketer.affiliateCode,
            },
        };

        if (marketer.status !== AMarketerStatus.PendingEmailVerification) {
            const pAccessToken = proposerAccessTokenGenerate(
                Role.Marketer,
                payload.email,
                marketer.id,
            );

            if (responseData.data == null) {
                throw new Error("ResponseData data value equal to null");
            }
            responseData.data.accessToken = pAccessToken;
        }

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {marketerLogin} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
