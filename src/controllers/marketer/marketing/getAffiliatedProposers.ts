import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import { type PaymentStatus, type Prisma } from "@prisma/client";

type ProposerResponse = {
    id: number;
    paymentValue: number;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    firstName: string;
    lastName: `${string}` & { length: 1 };
    country?: string;
};

type ApiResponse = {
    success: boolean;
    data?: ProposerResponse[];
    message?: string;
    errors?: ValidationError[];
    pagination?: {
        totalCount: number;
        count: number;
        totalPages: number;
        page: number;
    };
};

export const getAffiliatedProposers = async (
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

        const pageNumber: number =
            Number(req.query.page) > 0 ? Number(req.query.page) : 1;
        const pageSize: number =
            Number(req.query.pageSize) > 0 ? Number(req.query.pageSize) : 10;

        console.log(
            `{marketer marketing getAffiliatedProposers} query parameters : ${pageNumber}, ${pageSize}`,
        );

        const pageSkip: number = pageSize * (pageNumber - 1);

        const referredProposersSelect: Prisma.MarketerReferredProposalWhereInput =
            {
                marketerId: aMarketerId,
            };

        const [referredProposers, count] = await prisma.$transaction([
            prisma.marketerReferredProposal.findMany({
                skip: pageSkip,
                take: pageSize,
                select: {
                    id: true,
                    paymentValue: true,
                    paymentStatus: true,
                    createdAt: true,
                    proposer: {
                        select: {
                            firstName: true,
                            lastName: true,
                            proposal: {
                                select: {
                                    country: true,
                                },
                            },
                        },
                    },
                },
                where: referredProposersSelect,
            }),
            prisma.marketerReferredProposal.count({
                where: referredProposersSelect,
            }),
        ]);

        console.log(
            `{marketer marketing getAffiliatedProposers} proposers count: ${count}, Response :`,
            referredProposers,
        );

        const proposerResponse: ProposerResponse[] = [];

        for (const rProposer of referredProposers) {
            if (rProposer.proposer == null) {
                throw new Error(
                    `Found marketer referredProposer, that not having a proposer, marketerReferredProposerId: ${rProposer.id}`,
                );
            }
            proposerResponse.push({
                id: rProposer.id,
                paymentValue: rProposer.paymentValue,
                paymentStatus: rProposer.paymentStatus,
                createdAt: rProposer.createdAt,
                firstName: rProposer.proposer.firstName,
                lastName: rProposer.proposer.lastName[0] as `${string}` & {
                    length: 1;
                },
                country: rProposer.proposer.proposal?.country,
            });
        }

        const responseData: ApiResponse = {
            success: true,
            data: proposerResponse,
            pagination: {
                totalCount: count,
                count: referredProposers.length,
                totalPages: Math.ceil(count / pageSize),
                page: pageNumber,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {marketer marketing getAffiliatedProposers} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
