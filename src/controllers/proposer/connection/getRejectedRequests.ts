import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import { ProposerStatus, MatchingProposalStatus } from "@prisma/client";

type RejectedRequest = {
    id: number;
    status: MatchingProposalStatus;
    firstName: string;
    lastName: string;
    receiverId: number;
    isIPropose: boolean;
};

type ApiResponse = {
    success: boolean;
    data?: RejectedRequest[];
    message?: string;
    errors?: ValidationError[];
};

export const getRejectedRequests = async (
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
                proposing: {
                    where: {
                        AND: [
                            { status: MatchingProposalStatus.Rejected },
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
                proposeReceiving: {
                    where: {
                        AND: [
                            { status: MatchingProposalStatus.Rejected },
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
            },
        });

        console.log(
            "found proposer data {proposer - getRejectedConnectionRequests} : ",
            proposer,
        );

        if (proposer == null) {
            throw new Error("proposer data not found");
        }

        const rejectedRequests: RejectedRequest[] = [];

        for (const connectionRequest of proposer.proposing) {
            rejectedRequests.push({
                id: connectionRequest.id,
                receiverId: connectionRequest.proposeReceiverId,
                status: connectionRequest.status,
                firstName: connectionRequest.proposeReceiver.firstName,
                lastName: connectionRequest.proposeReceiver.lastName,
                isIPropose: true,
            });
        }

        for (const connectionRequest of proposer.proposeReceiving) {
            rejectedRequests.push({
                id: connectionRequest.id,
                receiverId: connectionRequest.proposerId,
                status: connectionRequest.status,
                firstName: connectionRequest.proposer.firstName,
                lastName: connectionRequest.proposer.lastName,
                isIPropose: false,
            });
        }

        const responseData: ApiResponse = {
            success: true,
            data: rejectedRequests,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {proposer-getRejectedConnectionRequests} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
