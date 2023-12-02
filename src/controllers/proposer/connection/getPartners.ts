import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import { ProposerStatus, MatchingProposalStatus } from "@prisma/client";

type Partner = {
    id: number;
    status: MatchingProposalStatus;
    firstName: string;
    lastName: string;
    proposerId: number;
};

type ApiResponse = {
    success: boolean;
    data?: Partner[];
    message?: string;
    errors?: ValidationError[];
};

export const getPartners = async (
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

        console.log("res locals", res.locals.proposerId);

        const proposerId: number | undefined = res.locals.proposerId;

        if (proposerId == null) {
            throw new Error("res local not have valid proposerId");
        }

        const proposer = await prisma.proposer.findUnique({
            where: {
                id: proposerId,
            },
            select: {
                proposeReceiving: {
                    where: {
                        AND: [
                            { status: MatchingProposalStatus.Accepted },
                            {
                                proposer: {
                                    AND: [
                                        { status: ProposerStatus.Active },
                                        {
                                            membershipExpiration: {
                                                gt: new Date(),
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    select: {
                        id: true,
                        status: true,
                        proposerId: true,
                        proposer: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                proposing: {
                    where: {
                        AND: [
                            { status: MatchingProposalStatus.Accepted },
                            {
                                proposeReceiver: {
                                    AND: [
                                        { status: ProposerStatus.Active },
                                        {
                                            membershipExpiration: {
                                                gt: new Date(),
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    select: {
                        id: true,
                        status: true,
                        proposeReceiverId: true,
                        proposeReceiver: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        console.log(
            "found proposer data {proposer - getConnectedPartners} : ",
            proposer,
        );

        if (proposer == null) {
            throw new Error("proposer data not found");
        }

        const connectedPartners: Partner[] = [];

        for (const connectionRequest of proposer.proposing) {
            connectedPartners.push({
                id: connectionRequest.id,
                proposerId: connectionRequest.proposeReceiverId,
                status: connectionRequest.status,
                firstName: connectionRequest.proposeReceiver.firstName,
                lastName: connectionRequest.proposeReceiver.lastName,
            });
        }

        for (const connectionRequest of proposer.proposeReceiving) {
            connectedPartners.push({
                id: connectionRequest.id,
                proposerId: connectionRequest.proposerId,
                status: connectionRequest.status,
                firstName: connectionRequest.proposer.firstName,
                lastName: connectionRequest.proposer.lastName,
            });
        }

        const responseData: ApiResponse = {
            success: true,
            data: connectedPartners,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {proposer-getConnectedPartners} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
