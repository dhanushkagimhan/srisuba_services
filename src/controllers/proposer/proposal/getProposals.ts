import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { Gender, type Prisma, ProposerStatus } from "@prisma/client";
import { type ValidationError, validationResult } from "express-validator";
import dayjs from "dayjs";

type ProposerResponse = {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    profilePhoto: string;
    city: string;
    country: string;
    ethnicity: string;
    religion: string;
    age: number;
    profession: string;
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

export const getProposals = async (
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

        const proposerGender: Gender | undefined = res.locals.proposerGender;

        if (proposerGender == null) {
            throw new Error("res local not have valid proposerGender");
        }

        const interestGender: Gender =
            proposerGender === Gender.Male ? Gender.Female : Gender.Male;

        const pageNumber: number =
            Number(req.query.page) > 0 ? Number(req.query.page) : 1;
        const pageSize: number =
            Number(req.query.pageSize) > 0 ? Number(req.query.pageSize) : 10;

        console.log(
            `{proposer-getProposals} query parameters : ${pageNumber}, ${pageSize}, interestGender : ${interestGender}`,
        );

        const pageSkip: number = pageSize * (pageNumber - 1);

        const proposalsSelect: Prisma.ProposerWhereInput = {
            AND: [
                { status: ProposerStatus.Active },
                {
                    membershipExpiration: {
                        gt: new Date(),
                    },
                },
                {
                    gender: interestGender,
                },
            ],
        };

        const [proposers, count] = await prisma.$transaction([
            prisma.proposer.findMany({
                skip: pageSkip,
                take: pageSize,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    gender: true,
                    birthDay: true,
                    status: true,
                    membershipExpiration: true,
                    proposal: {
                        select: {
                            profilePhoto: true,
                            city: true,
                            country: true,
                            ethnicity: true,
                            religion: true,
                            profession: true,
                        },
                    },
                },
                where: proposalsSelect,
            }),
            prisma.proposer.count({ where: proposalsSelect }),
        ]);

        console.log(
            `{proposer - getProposals} proposers count: ${count}, Response :`,
            proposers,
        );

        const proposerResponse: ProposerResponse[] = [];

        for (const proposer of proposers) {
            if (proposer.proposal == null) {
                throw new Error(
                    `Found proposer, that not having proposal, ProposerId: ${proposer.id}`,
                );
            }
            proposerResponse.push({
                id: proposer.id,
                firstName: proposer.firstName,
                lastName: proposer.lastName,
                gender: proposer.gender,
                profilePhoto: proposer.proposal.profilePhoto,
                city: proposer.proposal.city,
                country: proposer.proposal.country,
                ethnicity: proposer.proposal.ethnicity,
                religion: proposer.proposal.religion,
                age: dayjs().diff(proposer.birthDay, "year"),
                profession: proposer.proposal.profession,
            });
        }

        const responseData: ApiResponse = {
            success: true,
            data: proposerResponse,
            pagination: {
                totalCount: count,
                count: proposers.length,
                totalPages: Math.ceil(count / pageSize),
                page: pageNumber,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer-getProposals} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
