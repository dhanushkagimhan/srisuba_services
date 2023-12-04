import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: {
        bankName: string;
        branch: string;
        accountHolderName: string;
        accountNumber: string;
    };
    message?: string;
    errors?: ValidationError[];
};

export const getBankAccount = async (
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
                email: true,
                bankAccount: {
                    select: {
                        bankName: true,
                        branch: true,
                        accountHolderName: true,
                        accountNumber: true,
                    },
                },
            },
        });

        console.log(
            "{marketer getBankAccount} found marketer data : ",
            marketer,
        );

        if (marketer == null) {
            throw new Error("marketer data not found");
        }

        if (marketer.bankAccount == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Not found bank account data",
            };
            return res.status(404).send(responseData);
        }

        const responseData: ApiResponse = {
            success: true,
            data: {
                bankName: marketer.bankAccount.bankName,
                branch: marketer.bankAccount.branch,
                accountHolderName: marketer.bankAccount.accountHolderName,
                accountNumber: marketer.bankAccount.accountNumber,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {marketer getBankAccount} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
