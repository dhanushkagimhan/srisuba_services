import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: {
        proposalPrice: number;
        systemIncomeBalance: number;
        totalSystemAccountBalance: number;
        totalAffiliateMarketersCost: number;
        createdAt: Date;
        updatedAt: Date;
    };
    message?: string;
    errors?: ValidationError[];
};

export const getSystemDetails = async (
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

        const systemData = await prisma.system.findUnique({
            where: {
                name: "srisuba",
            },
            select: {
                proposalPrice: true,
                systemIncomeBalance: true,
                totalSystemAccountBalance: true,
                totalAffiliateMarketersCost: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        console.log("{Admin - getSystemDetails} system data : ", systemData);

        if (systemData == null) {
            throw new Error("system data not found");
        }

        const responseData: ApiResponse = {
            success: true,
            data: systemData,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {admin-getSystemDetails} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
