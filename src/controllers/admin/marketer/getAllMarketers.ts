import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type Gender, type Prisma, type AMarketerStatus } from "@prisma/client";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: Array<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        gender: Gender;
        country: string;
        affiliateCode: string | null;
        accountBalance: number;
        status: AMarketerStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    message?: string;
    errors?: ValidationError[];
    pagination?: {
        totalCount: number;
        count: number;
        totalPages: number;
        page: number;
    };
};

export const getAllMarketers = async (
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

        const pageNumber: number =
            Number(req.query.page) > 0 ? Number(req.query.page) : 1;
        const pageSize: number =
            Number(req.query.pageSize) > 0 ? Number(req.query.pageSize) : 10;

        const isOnlyWithdrawAvailable: boolean =
            req.query.isOnlyWithdrawAvailable === "true";
        const orderDesc: boolean = req.query.orderDesc === "true";

        console.log(
            `{admin-getAllMarketers} query parameters : ${pageNumber}, ${pageSize}, ${isOnlyWithdrawAvailable}, ${orderDesc}`,
        );

        const pageSkip: number = pageSize * (pageNumber - 1);

        const marketerSelect: Prisma.AffiliateMarketerFindManyArgs = {
            skip: pageSkip,
            take: pageSize,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                gender: true,
                country: true,
                affiliateCode: true,
                status: true,
                accountBalance: true,
                createdAt: true,
                updatedAt: true,
            },
        };

        if (isOnlyWithdrawAvailable) {
            marketerSelect.where = {
                accountBalance: {
                    gt: 0,
                },
            };
        }

        if (orderDesc) {
            marketerSelect.orderBy = { id: "desc" };
        }

        const [marketers, count] = await prisma.$transaction([
            prisma.affiliateMarketer.findMany(marketerSelect),
            prisma.affiliateMarketer.count({ where: marketerSelect.where }),
        ]);

        console.log(
            "{Admin - getAllMarketers} marketers response : ",
            marketers,
        );

        const responseData: ApiResponse = {
            success: true,
            data: marketers,
            pagination: {
                totalCount: count,
                count: marketers.length,
                totalPages: Math.ceil(count / pageSize),
                page: pageNumber,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {admin-getAllMarketers} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
