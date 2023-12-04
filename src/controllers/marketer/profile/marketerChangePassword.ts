import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import bcrypt from "bcrypt";

type RequestPayload = {
    currentPassword: string;
    newPassword: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const marketerChangePassword = async (
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

        console.log("res locals", res.locals.marketerId);

        const marketerId: number | undefined = res.locals.marketerId;

        if (marketerId == null) {
            throw new Error("res local not have valid marketerId");
        }

        const payload: RequestPayload = req.body;

        const marketer = await prisma.affiliateMarketer.findUnique({
            where: {
                id: marketerId,
            },
            select: {
                id: true,
                password: true,
            },
        });

        console.log("{marketerChangePassword} marketer : ", marketer);

        if (marketer == null) {
            throw new Error("marketer not found");
        }

        const isMatch: boolean = bcrypt.compareSync(
            payload.currentPassword,
            marketer.password,
        );

        if (!isMatch) {
            const responseData: ApiResponse = {
                success: false,
                message: "current password is wrong",
            };
            return res.status(403).send(responseData);
        }

        const saltRound = 8;
        const hashPassword: string = await bcrypt.hash(
            payload.newPassword,
            saltRound,
        );

        const updatedMarketer = await prisma.affiliateMarketer.update({
            where: {
                id: marketerId,
            },
            data: {
                password: hashPassword,
            },
            select: {
                id: true,
                password: true,
            },
        });

        console.log(
            "{marketerChangePassword} password updated : ",
            updatedMarketer,
        );

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {marketerChangePassword} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
