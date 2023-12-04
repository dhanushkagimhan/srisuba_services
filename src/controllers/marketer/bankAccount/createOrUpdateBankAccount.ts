import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import { type Prisma } from "@prisma/client";

type RequestPayload = {
    bankName: string;
    branch: string;
    accountHolderName: string;
    accountNumber: string;
};

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

export const createOrUpdateBankAccount = async (
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

        console.log("{marketer createOrUpdateBankAccount} payload : ", payload);

        console.log("res locals", res.locals.marketerId);

        const marketerId: number | undefined = res.locals.marketerId;

        if (marketerId == null) {
            throw new Error("res local not have valid marketerId");
        }

        const bankAccount: Prisma.MarketerBankAccountCreateWithoutMarketerInput =
            {
                bankName: payload.bankName,
                branch: payload.branch,
                accountHolderName: payload.accountHolderName,
                accountNumber: payload.accountNumber,
            };

        const marketer = await prisma.affiliateMarketer.update({
            where: {
                id: marketerId,
            },
            data: {
                bankAccount: {
                    upsert: {
                        create: bankAccount,
                        update: bankAccount,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                bankAccount: true,
            },
        });

        console.log(
            "{marketer createOrUpdateBankAccount} updated marketer data : ",
            marketer,
        );

        if (marketer.bankAccount == null) {
            throw new Error(
                "Bank account details haven't in the updating response",
            );
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
        console.log(
            `Unexpected Error {marketer createOrUpdateBankAccount} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
