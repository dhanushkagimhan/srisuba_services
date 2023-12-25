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

export const getSystemWithdrawals = async (
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

        const systemWithdrawals = await prisma.systemWithdrawal.findMany({
            orderBy: { id: "desc" },
        });

        console.log(
            "{Admin - getSystemWithdrawals} system withdrawals : ",
            systemWithdrawals,
        );

        const responseData: ApiResponse = {
            success: true,
            data: systemWithdrawals,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {admin-getSystemWithdrawals} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
