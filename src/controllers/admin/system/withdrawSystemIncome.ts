import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type RequestPayload = {
    amount: number;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const withdrawSystemIncome = async (
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

        console.log("{admin-withdrawSystemIncome} payload : ", payload);

        for (let i = 0; i < 5; i++) {
            console.log("{admin-withdrawSystemIncome} tranx tries : ", i + 1);
            try {
                const txResponse = await prisma.$transaction(
                    async (tx) => {
                        const systemData = await tx.system.findUnique({
                            where: {
                                name: "srisuba",
                            },
                            select: {
                                totalSystemAccountBalance: true,
                                systemIncomeBalance: true,
                            },
                        });

                        if (systemData == null) {
                            throw new Error("system not found");
                        }

                        if (systemData.systemIncomeBalance < payload.amount) {
                            throw new Error(
                                `systemData.systemIncomeBalance < payload.amount`,
                            );
                        }

                        if (
                            systemData.totalSystemAccountBalance <
                            payload.amount
                        ) {
                            throw new Error(
                                `systemData.totalSystemAccountBalance < payload.amount`,
                            );
                        }

                        const newTotalSystemAccountBalance =
                            systemData.totalSystemAccountBalance -
                            payload.amount;

                        const newSystemIncomeBalance =
                            systemData.systemIncomeBalance - payload.amount;

                        const systemUpdated = await tx.system.update({
                            where: {
                                name: "srisuba",
                            },
                            data: {
                                totalSystemAccountBalance:
                                    newTotalSystemAccountBalance,
                                systemIncomeBalance: newSystemIncomeBalance,
                            },
                            select: {
                                totalSystemAccountBalance: true,
                                systemIncomeBalance: true,
                            },
                        });

                        const systemWithdrawal =
                            await prisma.systemWithdrawal.create({
                                data: {
                                    value: payload.amount,
                                },
                            });

                        return [systemUpdated, systemWithdrawal];
                    },
                    {
                        isolationLevel:
                            Prisma.TransactionIsolationLevel.Serializable,
                    },
                );

                for (const j of txResponse) {
                    console.log(
                        "{admin-withdrawSystemIncome} tranx successfully : ",
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
        console.log(`Unexpected Error {admin-withdrawSystemIncome} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
