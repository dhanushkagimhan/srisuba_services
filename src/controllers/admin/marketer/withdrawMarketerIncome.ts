import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type RequestPayload = {
    marketerId: number;
    amount: number;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const withdrawMarketerIncome = async (
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

        console.log("{admin-withdrawMarketerIncome} payload : ", payload);

        for (let i = 0; i < 5; i++) {
            console.log("{admin-withdrawMarketerIncome} tranx tries : ", i + 1);
            try {
                const txResponse = await prisma.$transaction(
                    async (tx) => {
                        const marketer = await tx.affiliateMarketer.findUnique({
                            where: {
                                id: payload.marketerId,
                            },
                            select: {
                                id: true,
                                accountBalance: true,
                            },
                        });

                        if (marketer == null) {
                            throw new Error("marketer not found");
                        }

                        if (marketer.accountBalance < payload.amount) {
                            throw new Error(
                                `This amount can't withdraw, only can withdraw : ${marketer.accountBalance}`,
                            );
                        }

                        const systemData = await tx.system.findUnique({
                            where: {
                                name: "srisuba",
                            },
                            select: {
                                totalSystemAccountBalance: true,
                                totalAffiliateMarketersCost: true,
                            },
                        });

                        if (systemData == null) {
                            throw new Error("Not found system data");
                        }

                        if (
                            systemData.totalAffiliateMarketersCost <
                            payload.amount
                        ) {
                            throw new Error(
                                "systemData.totalAffiliateMarketersCost < payload.amount",
                            );
                        }

                        if (
                            systemData.totalSystemAccountBalance <
                            payload.amount
                        ) {
                            throw new Error(
                                "systemData.totalSystemAccountBalance < payload.amount",
                            );
                        }

                        const newMarketerAccBalance =
                            marketer.accountBalance - payload.amount;

                        const marketerUpdated =
                            await tx.affiliateMarketer.update({
                                where: {
                                    id: payload.marketerId,
                                },
                                data: {
                                    accountBalance: newMarketerAccBalance,
                                },
                                select: {
                                    id: true,
                                    accountBalance: true,
                                },
                            });

                        const marketerWithdrawal =
                            await prisma.marketerWithdrawal.create({
                                data: {
                                    marketerId: payload.marketerId,
                                    value: payload.amount,
                                },
                            });

                        const newTotalSystemAccountBalance =
                            systemData.totalSystemAccountBalance -
                            payload.amount;

                        const newTotalAffiliateMarketersCost =
                            systemData.totalAffiliateMarketersCost -
                            payload.amount;

                        const systemUpdated = await tx.system.update({
                            where: {
                                name: "srisuba",
                            },
                            data: {
                                totalSystemAccountBalance:
                                    newTotalSystemAccountBalance,
                                totalAffiliateMarketersCost:
                                    newTotalAffiliateMarketersCost,
                            },
                            select: {
                                totalSystemAccountBalance: true,
                                totalAffiliateMarketersCost: true,
                            },
                        });

                        return [
                            marketerUpdated,
                            marketerWithdrawal,
                            systemUpdated,
                        ];
                    },
                    {
                        isolationLevel:
                            Prisma.TransactionIsolationLevel.Serializable,
                    },
                );

                for (const j of txResponse) {
                    console.log(
                        "{admin-approveProposerPayment} tranx successfully : ",
                        j,
                    );
                }
                const responseData: ApiResponse = {
                    success: true,
                };

                return res.status(200).send(responseData);
            } catch (error) {
                if (
                    error instanceof PrismaClientKnownRequestError &&
                    error.code === "P2034"
                ) {
                    continue;
                }
                throw error;
            }
        }

        throw new Error("Failed all 5 transaction tries");
    } catch (error) {
        console.log(
            `Unexpected Error {admin-withdrawMarketerIncome} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
