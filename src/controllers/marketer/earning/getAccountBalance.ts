import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: {
        accountBalance: number;
    };
    message?: string;
    errors?: ValidationError[];
};

export const getAccountBalance = async (
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

        const marketer = await prisma.affiliateMarketer.findUnique({
            where: {
                id: marketerId,
            },
            select: {
                id: true,
                accountBalance: true,
            },
        });

        console.log(
            "{marketer getAccountBalance} found marketer data : ",
            marketer,
        );

        if (marketer == null) {
            throw new Error("marketer data not found");
        }

        const responseData: ApiResponse = {
            success: true,
            data: {
                accountBalance: marketer.accountBalance,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {marketer getAccountBalance} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
