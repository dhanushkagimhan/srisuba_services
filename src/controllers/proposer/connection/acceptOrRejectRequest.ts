import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import { ProposerStatus, MatchingProposalStatus } from "@prisma/client";

type RequestPayload = {
    requestId: number;
    status: MatchingProposalStatus;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const acceptOrRejectRequest = async (
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

        console.log(
            "{proposer-acceptOrRejectConnectionRequest} payload : ",
            payload,
        );

        console.log("res locals", res.locals.proposerId);

        const myProposerId: number | undefined = res.locals.proposerId;

        if (myProposerId == null) {
            throw new Error("res local not have valid proposerId");
        }

        const connectionRequest = await prisma.matchingProposal.findUnique({
            where: {
                id: payload.requestId,
            },
            select: {
                status: true,
                proposeReceiverId: true,
                proposer: {
                    select: {
                        status: true,
                        membershipExpiration: true,
                    },
                },
            },
        });

        console.log(
            "found connectionRequest data {proposer - acceptOrRejectConnectionRequest} : ",
            connectionRequest,
        );

        if (connectionRequest == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Not found request data",
            };
            return res.status(404).send(responseData);
        }

        if (connectionRequest.proposeReceiverId !== myProposerId) {
            const responseData: ApiResponse = {
                success: false,
                message: "can not execute this request",
            };
            return res.status(403).send(responseData);
        }

        if (connectionRequest.status !== MatchingProposalStatus.Pending) {
            const responseData: ApiResponse = {
                success: false,
                message: "connection status not equal to pending",
            };
            return res.status(400).send(responseData);
        }

        if (connectionRequest.proposer.status !== ProposerStatus.Active) {
            const responseData: ApiResponse = {
                success: false,
                message: "Proposer status is not equal to Active",
            };
            return res.status(400).send(responseData);
        }

        if (connectionRequest.proposer.membershipExpiration < new Date()) {
            const responseData: ApiResponse = {
                success: false,
                message: "Proposer membership expired",
            };
            return res.status(400).send(responseData);
        }

        const connectionUpdated = await prisma.matchingProposal.update({
            where: {
                id: payload.requestId,
            },
            data: {
                status: payload.status,
            },
        });

        console.log(
            "connection updated {proposer - acceptOrRejectConnectionRequest} : ",
            connectionUpdated,
        );

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {proposer-acceptOrRejectConnectionRequest} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
