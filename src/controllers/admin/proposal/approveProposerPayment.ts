import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import {
    PaymentStatus,
    Prisma,
    ProposerPaymentType,
    ProposerStatus,
} from "@prisma/client";
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

export const approveProposerPayment = async (
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

        console.log("{admin-approveProposerPayment} payload : ", payload);

        const proposer = await prisma.proposer.findUnique({
            where: {
                id: payload.proposerId,
            },
            select: {
                status: true,
                membershipExpiration: true,
                payments: {
                    select: {
                        id: true,
                        value: true,
                        type: true,
                        status: true,
                    },
                },
                referredMarketer: {
                    select: {
                        id: true,
                        paymentStatus: true,
                        paymentValue: true,
                        marketerId: true,
                    },
                },
            },
        });

        console.log(
            "found proposer {admin-approveProposerPayment} : ",
            proposer,
        );

        if (proposer == null) {
            throw new Error("proposer not found");
        }

        if (proposer.payments.length !== 1) {
            throw new Error("invalid payment records");
        }

        if (
            proposer.status !== ProposerStatus.PendingPayment ||
            proposer.payments[0].status !== PaymentStatus.Pending ||
            proposer.payments[0].type !== ProposerPaymentType.Initial ||
            (proposer.referredMarketer != null &&
                proposer.referredMarketer.paymentStatus !==
                    PaymentStatus.Pending)
        ) {
            const responseData: ApiResponse = {
                success: false,
                message: "proposer status validation failed",
            };
            return res.status(400).send(responseData);
        }

        const membershipExpirationRenew: Date = dayjs().add(92, "day").toDate();

        for (let i = 0; i < 5; i++) {
            console.log("{admin-approveProposerPayment} tranx tries : ", i + 1);
            try {
                const txResponse = await prisma.$transaction(
                    async (tx) => {
                        const proposerUpdated = await tx.proposer.update({
                            data: {
                                status: ProposerStatus.PaymentApproved,
                                membershipExpiration: membershipExpirationRenew,
                                payments: {
                                    update: {
                                        data: {
                                            status: PaymentStatus.Approved,
                                        },
                                        where: {
                                            id: proposer.payments[0].id,
                                        },
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
                                        value: true,
                                        status: true,
                                    },
                                },
                            },
                        });

                        const systemData = await tx.system.findUnique({
                            where: {
                                name: "srisuba",
                            },
                            select: {
                                systemIncomeBalance: true,
                                totalSystemAccountBalance: true,
                                totalAffiliateMarketersCost: true,
                            },
                        });

                        if (systemData == null) {
                            throw new Error("Not found system data");
                        }

                        let sIncomeBalance = systemData.systemIncomeBalance;
                        let totalSAccountBalance =
                            systemData.totalSystemAccountBalance;
                        let totalAMarketersCost =
                            systemData.totalAffiliateMarketersCost;

                        totalSAccountBalance += proposer.payments[0].value;

                        let marketerReferredData;
                        let marketerData;

                        if (proposer.referredMarketer == null) {
                            sIncomeBalance += proposer.payments[0].value;
                        } else {
                            totalAMarketersCost +=
                                proposer.referredMarketer.paymentValue;
                            sIncomeBalance +=
                                proposer.payments[0].value -
                                proposer.referredMarketer.paymentValue;

                            marketerReferredData =
                                await tx.marketerReferredProposal.update({
                                    where: {
                                        id: proposer.referredMarketer.id,
                                    },
                                    data: {
                                        paymentStatus: PaymentStatus.Approved,
                                    },
                                    select: {
                                        id: true,
                                        paymentStatus: true,
                                        marketer: {
                                            select: {
                                                accountBalance: true,
                                            },
                                        },
                                    },
                                });

                            const marketerAccountBalance =
                                marketerReferredData.marketer.accountBalance +
                                proposer.referredMarketer.paymentValue;

                            marketerData = await tx.affiliateMarketer.update({
                                where: {
                                    id: proposer.referredMarketer.marketerId,
                                },
                                data: {
                                    accountBalance: marketerAccountBalance,
                                },
                            });
                        }

                        const systemUpdated = await tx.system.update({
                            where: {
                                name: "srisuba",
                            },
                            data: {
                                systemIncomeBalance: sIncomeBalance,
                                totalSystemAccountBalance: totalSAccountBalance,
                                totalAffiliateMarketersCost:
                                    totalAMarketersCost,
                            },
                            select: {
                                systemIncomeBalance: true,
                                totalSystemAccountBalance: true,
                                totalAffiliateMarketersCost: true,
                            },
                        });

                        return [
                            proposerUpdated,
                            marketerReferredData,
                            marketerData,
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
            `Unexpected Error {admin-approveProposerPayment} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
