import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import { PaymentStatus, Prisma, ProposerPaymentType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import dayjs from "dayjs";

type RequestPayload = {
    proposerId: number;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const renewMembership = async (
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

        console.log("{admin-renewProposerMembership} payload : ", payload);

        const membershipExpirationRenew: Date = dayjs().add(92, "day").toDate();

        for (let i = 0; i < 5; i++) {
            console.log(
                "{admin-renewProposerMembership} tranx tries : ",
                i + 1,
            );
            try {
                const txResponse = await prisma.$transaction(
                    async (tx) => {
                        const systemData = await tx.system.findUnique({
                            where: {
                                name: "srisuba",
                            },
                            select: {
                                systemIncomeBalance: true,
                                totalSystemAccountBalance: true,
                                proposalPrice: true,
                            },
                        });

                        if (systemData == null) {
                            throw new Error("Not found system data");
                        }

                        const proposerUpdated = await tx.proposer.update({
                            data: {
                                membershipExpiration: membershipExpirationRenew,
                                payments: {
                                    create: {
                                        type: ProposerPaymentType.Renewal,
                                        status: PaymentStatus.Approved,
                                        value: systemData.proposalPrice,
                                    },
                                },
                            },
                            where: {
                                id: payload.proposerId,
                            },
                            select: {
                                id: true,
                                email: true,
                                membershipExpiration: true,
                                payments: {
                                    select: {
                                        id: true,
                                        type: true,
                                        value: true,
                                        status: true,
                                    },
                                },
                            },
                        });

                        const sIncomeBalance =
                            systemData.systemIncomeBalance +
                            systemData.proposalPrice;
                        const totalSAccountBalance =
                            systemData.totalSystemAccountBalance +
                            systemData.proposalPrice;

                        const systemUpdated = await tx.system.update({
                            where: {
                                name: "srisuba",
                            },
                            data: {
                                systemIncomeBalance: sIncomeBalance,
                                totalSystemAccountBalance: totalSAccountBalance,
                            },
                            select: {
                                systemIncomeBalance: true,
                                totalSystemAccountBalance: true,
                                totalAffiliateMarketersCost: true,
                            },
                        });

                        return [proposerUpdated, systemUpdated];
                    },
                    {
                        isolationLevel:
                            Prisma.TransactionIsolationLevel.Serializable,
                    },
                );

                for (const j of txResponse) {
                    console.log(
                        "{admin-renewProposerMembership} tranx successfully : ",
                        JSON.stringify(j),
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
            `Unexpected Error {admin-renewProposerMembership} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
