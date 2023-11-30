import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import { ProposerStatus } from "@prisma/client";

type ApiResponse = {
    success: boolean;
    data?: {
        status: string;
        reason: string | null;
    };
    message?: string;
    errors?: ValidationError[];
};

export const getBlockReason = async (
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

        console.log("res locals {getBlockReason}", res.locals.proposerId);

        const proposerId: number | undefined = res.locals.proposerId;

        if (proposerId == null) {
            throw new Error("res local not have valid proposerId");
        }

        const proposer = await prisma.proposer.findUnique({
            where: {
                id: proposerId,
            },
            select: {
                status: true,
                rejectOrBannedReason: {
                    select: {
                        reason: true,
                    },
                },
            },
        });

        console.log("found proposer data {getBlockReason} : ", proposer);

        if (proposer == null) {
            throw new Error("proposer data not found");
        }

        if (
            proposer.status !== ProposerStatus.Rejected &&
            proposer.status !== ProposerStatus.Banned
        ) {
            const responseData: ApiResponse = {
                success: false,
                message: "proposer status is not support to this request",
            };
            return res.status(400).send(responseData);
        }

        const responseData: ApiResponse = {
            success: true,
            data: {
                status: proposer.status,
                reason: proposer.rejectOrBannedReason?.reason ?? null,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer-getBlockReason} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
