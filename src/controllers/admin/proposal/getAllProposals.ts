import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import {
    type Gender,
    type Prisma,
    ProposerStatus,
    type ProposerPaymentType,
    type PaymentStatus,
} from "@prisma/client";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: Array<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        gender: Gender;
        birthDay: Date;
        status: ProposerStatus;
        membershipExpiration: Date;
        createdAt: Date;
        updatedAt: Date;
        payments?: Array<{
            type: ProposerPaymentType;
            value: number;
            status: PaymentStatus;
        }>;
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

export const getAllProposals = async (
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
        const proposerStatus: string | undefined =
            typeof req.query.proposerStatus === "string"
                ? req.query.proposerStatus
                : undefined;
        const isOnlyExpired: boolean = req.query.isOnlyExpired === "true";
        const isIncludePayments: boolean =
            req.query.isIncludePayments === "true";

        console.log(
            `{admin-getAllProposals} query parameters : ${pageNumber}, ${pageSize}, ${proposerStatus}, ${isOnlyExpired}, ${isIncludePayments}`,
        );

        const proposalStatusEnum: ProposerStatus | undefined =
            ProposerStatus[proposerStatus as keyof typeof ProposerStatus];

        if (proposerStatus != null && proposalStatusEnum == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "invalid proposerStatus",
            };
            return res.status(400).send(responseData);
        }

        const pageSkip: number = pageSize * (pageNumber - 1);

        const proposalsSelect: Prisma.ProposerFindManyArgs = {
            skip: pageSkip,
            take: pageSize,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                gender: true,
                birthDay: true,
                status: true,
                membershipExpiration: true,
                createdAt: true,
                updatedAt: true,
            },
        };

        if (isIncludePayments && proposalsSelect.select != null) {
            proposalsSelect.select.payments = {
                select: {
                    type: true,
                    value: true,
                    status: true,
                },
            };
        }

        if (proposalStatusEnum != null || isOnlyExpired) {
            const proposalwhereSelect: Prisma.ProposerWhereInput = {};

            if (proposalStatusEnum != null) {
                proposalwhereSelect.status = {
                    equals: proposalStatusEnum,
                };
            }

            if (isOnlyExpired) {
                proposalwhereSelect.membershipExpiration = {
                    lt: new Date(),
                };
            }

            proposalsSelect.where = proposalwhereSelect;
        }

        const [proposers, count] = await prisma.$transaction([
            prisma.proposer.findMany(proposalsSelect),
            prisma.proposer.count({ where: proposalsSelect.where }),
        ]);

        console.log(
            "{Admin - getAllProposals} proposers response : ",
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
        console.log(`Unexpected Error {admin-getAllProposals} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
