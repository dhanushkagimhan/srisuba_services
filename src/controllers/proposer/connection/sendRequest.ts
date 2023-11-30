import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import { ProposerStatus, MatchingProposalStatus } from "@prisma/client";

type RejectRequest = {
    id: number;
    status: MatchingProposalStatus;
};

type RequestPayload = {
    proposerId: number;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const sendRequest = async (
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

        console.log("{proposer-sendConnectionRequest} payload : ", payload);

        console.log("res locals", res.locals.proposerId);

        const myProposerId: number | undefined = res.locals.proposerId;

        if (myProposerId == null) {
            throw new Error("res local not have valid proposerId");
        }

        const proposer = await prisma.proposer.findUnique({
            where: {
                id: payload.proposerId,
            },
            select: {
                status: true,
                membershipExpiration: true,
                proposing: {
                    where: {
                        proposeReceiverId: myProposerId,
                    },
                    select: {
                        id: true,
                        status: true,
                    },
                },
                proposeReceiving: {
                    where: {
                        proposerId: myProposerId,
                    },
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });

        console.log(
            "found proposer data {proposer - sendConnectionRequest} : ",
            proposer,
        );

        if (proposer == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "proposer not found",
            };
            return res.status(404).send(responseData);
        }

        if (proposer.status !== ProposerStatus.Active) {
            const responseData: ApiResponse = {
                success: false,
                message: "proposer status is not Active",
            };
            return res.status(400).send(responseData);
        }

        if (proposer.membershipExpiration < new Date()) {
            const responseData: ApiResponse = {
                success: false,
                message: "proposer membership is expired",
            };
            return res.status(400).send(responseData);
        }

        if (
            (proposer.proposing.length === 1 &&
                proposer.proposing[0].status !==
                    MatchingProposalStatus.Rejected) ||
            (proposer.proposeReceiving.length === 1 &&
                proposer.proposeReceiving[0].status !==
                    MatchingProposalStatus.Rejected)
        ) {
            const responseData: ApiResponse = {
                success: false,
                message:
                    "proposer connection status is not support to this request",
            };
            return res.status(400).send(responseData);
        }

        if (
            proposer.proposing.length > 1 ||
            proposer.proposeReceiving.length > 1
        ) {
            throw new Error(
                "Unexpected.. connection having more than 1 with same proposer",
            );
        }

        if (
            proposer.proposing.length === 1 ||
            proposer.proposeReceiving.length === 1
        ) {
            let rejectRequest: RejectRequest;

            if (proposer.proposing.length === 1) {
                rejectRequest = proposer.proposing[0];
            } else {
                rejectRequest = proposer.proposeReceiving[0];
            }

            const againSendRequest = await prisma.matchingProposal.update({
                where: {
                    id: rejectRequest.id,
                },
                data: {
                    status: MatchingProposalStatus.Pending,
                },
                select: {
                    id: true,
                    status: true,
                    proposerId: true,
                    proposeReceiverId: true,
                },
            });

            console.log(
                "{proposer-sendConnectionRequest} againSendRequest : ",
                againSendRequest,
            );
        } else {
            const proposerSendRequest = await prisma.proposer.update({
                where: {
                    id: myProposerId,
                },
                data: {
                    proposing: {
                        create: {
                            proposeReceiverId: payload.proposerId,
                            status: MatchingProposalStatus.Pending,
                        },
                    },
                },
                select: {
                    id: true,
                    email: true,
                    status: true,
                    proposing: {
                        select: {
                            id: true,
                            status: true,
                            proposerId: true,
                            proposeReceiverId: true,
                        },
                    },
                },
            });

            console.log(
                "{proposer-sendConnectionRequest} proposerSendRequest : ",
                proposerSendRequest,
            );
        }

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {proposer-sendConnectionRequest} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
