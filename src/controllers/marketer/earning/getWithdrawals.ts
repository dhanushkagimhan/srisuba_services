import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: Array<{
        id: number;
        value: number;
        createdAt: Date;
    }>;
    message?: string;
    errors?: ValidationError[];
};

export const getWithdrawals = async (
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

        const aMarketerId: number | undefined = res.locals.marketerId;

        if (aMarketerId == null) {
            throw new Error("res local not have valid marketerId");
        }

        const marketerWithdrawals = await prisma.marketerWithdrawal.findMany({
            where: {
                marketerId: aMarketerId,
            },
            select: {
                id: true,
                value: true,
                createdAt: true,
            },
        });

        console.log(
            "{marketer getWithdrawals} found marketer withdrawals : ",
            marketerWithdrawals,
        );

        const responseData: ApiResponse = {
            success: true,
            data: marketerWithdrawals,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {marketer getWithdrawals} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
