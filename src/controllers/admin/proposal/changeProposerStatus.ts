import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import { type Prisma, ProposerStatus } from "@prisma/client";

type RequestPayload = {
    proposerId: number;
    status: ProposerStatus;
    reason?: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const changeProposerStatus = async (
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

        console.log("admin-changeProposerStatus} payload :", payload);

        if (
            payload.status !== ProposerStatus.Reject &&
            payload.status !== ProposerStatus.Banned &&
            payload.reason != null
        ) {
            const responseData: ApiResponse = {
                success: false,
                message: "reason is invalid field for this request",
            };
            return res.status(400).send(responseData);
        }

        const proposerUpdate: Prisma.ProposerUpdateArgs = {
            where: {
                id: payload.proposerId,
            },
            data: {
                status: payload.status,
            },
            select: {
                id: true,
                status: true,
                rejectOrBannedReason: true,
            },
        };

        if (payload.reason != null) {
            proposerUpdate.data.rejectOrBannedReason = {
                upsert: {
                    create: {
                        reason: payload.reason,
                    },
                    update: {
                        reason: payload.reason,
                    },
                },
            };
        }

        const updatedProposer = await prisma.proposer.update(proposerUpdate);

        console.log(
            "{admin-changeProposerStatus} updated proposer : ",
            updatedProposer,
        );

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {admin-changeProposerStatus} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
