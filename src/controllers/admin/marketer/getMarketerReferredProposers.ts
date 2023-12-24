import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type Prisma, type PaymentStatus } from "@prisma/client";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: Array<{
        id: number;
        paymentStatus: PaymentStatus;
        paymentValue: number;
        proposerId: number;
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

export const getMarketerReferredProposers = async (
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

        const aMarketerId: number = Number(req.params.marketerId);

        console.log(
            `{admin-getMarketerReferredProposers} query parameters : ${pageNumber}, ${pageSize}, marketerId : ${aMarketerId}`,
        );

        const pageSkip: number = pageSize * (pageNumber - 1);

        const proposersSelect: Prisma.MarketerReferredProposalFindManyArgs = {
            skip: pageSkip,
            take: pageSize,
            select: {
                id: true,
                paymentStatus: true,
                paymentValue: true,
                proposerId: true,
                createdAt: true,
                updatedAt: true,
            },
            where: {
                marketerId: aMarketerId,
            },
            orderBy: {
                id: "desc",
            },
        };

        const [proposers, count] = await prisma.$transaction([
            prisma.marketerReferredProposal.findMany(proposersSelect),
            prisma.marketerReferredProposal.count({
                where: proposersSelect.where,
            }),
        ]);

        console.log(
            "{Admin - getMarketerReferredProposers} referred proposers response : ",
            proposers,
        );

        const responseData: ApiResponse = {
            success: true,
            data: proposers,
            pagination: {
                totalCount: count,
                count: proposers.length,
                totalPages: Math.ceil(count / pageSize),
                page: pageNumber,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {admin-getMarketerReferredProposers} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
