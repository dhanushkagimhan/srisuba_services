import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: Array<{
        id: number;
        value: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    message?: string;
    errors?: ValidationError[];
};

export const getMarketerWithdrawals = async (
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

        const aMarketerId: number = Number(req.params.marketerId);

        console.log("{getMarketerWithdrawals} marketerId :", aMarketerId);

        const marketerWithdrawals = await prisma.marketerWithdrawal.findMany({
            where: {
                marketerId: aMarketerId,
            },
            select: {
                id: true,
                value: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                id: "desc",
            },
        });

        console.log(
            "{Admin - getMarketerWithdrawals} marketer withdrawals : ",
            marketerWithdrawals,
        );

        const responseData: ApiResponse = {
            success: true,
            data: marketerWithdrawals,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {admin-getMarketerWithdrawals} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
