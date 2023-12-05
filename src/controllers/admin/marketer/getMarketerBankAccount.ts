import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: {
        id: number;
        accountHolderName: string;
        accountNumber: string;
        bankName: string;
        branch: string;
    };
    message?: string;
    errors?: ValidationError[];
};

export const getMarketerBankAccount = async (
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

        console.log("{getMarketerBankAccount} marketerId :", aMarketerId);

        const marketerBankAcc = await prisma.marketerBankAccount.findUnique({
            where: {
                marketerId: aMarketerId,
            },
            select: {
                id: true,
                accountHolderName: true,
                accountNumber: true,
                bankName: true,
                branch: true,
            },
        });

        console.log(
            "{Admin - getMarketerBankAccount} marketer bank acc : ",
            marketerBankAcc,
        );

        if (marketerBankAcc == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Not found bank account",
            };
            return res.status(404).send(responseData);
        }

        const responseData: ApiResponse = {
            success: true,
            data: marketerBankAcc,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {admin-getMarketerBankAccount} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
