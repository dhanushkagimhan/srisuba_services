import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import {
    ProposerStatus,
    Gender,
    ProposerPaymentType,
    PaymentStatus,
    type Prisma,
} from "@prisma/client";
import { type ValidationError, validationResult } from "express-validator";
import emailVerificationCode from "../../../utility/commonMethods/emailVerificationCode";
import proposalPriceGetter from "../../../utility/commonMethods/proposalPriceGetter";
import emailSender from "../../../utility/commonMethods/emailSender";
import dayjs from "dayjs";

type RequestPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    gender: Gender;
    referralCode?: string;
};

type ApiResponse = {
    success: boolean;
    data?: {
        email: string;
    };
    message?: string;
    errors?: ValidationError[];
};

export const register = async (
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

        const exists = await prisma.proposer.count({
            where: {
                email: payload.email,
            },
        });

        if (exists > 0) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is already registered!",
            };
            return res.status(400).send(responseData);
        }

        const proposalPrice: number = await proposalPriceGetter();

        const saltRound = 8;
        const hashPassword: string = await bcrypt.hash(
            payload.password,
            saltRound,
        );

        const [
            emailVerifyCode,
            hashEmailVerification,
            emailVerificationCodeExpireTime,
        ] = await emailVerificationCode();

        const pBirthDay = new Date(payload.birthDay);

        let proposerExpirationTime: Date;

        if (payload.gender === Gender.Female) {
            proposerExpirationTime = dayjs().add(365, "day").toDate();
        } else {
            proposerExpirationTime = new Date();
        }

        const newProposer: Prisma.ProposerCreateInput = {
            email: payload.email,
            password: hashPassword,
            firstName: payload.firstName,
            lastName: payload.lastName,
            birthDay: pBirthDay,
            gender: payload.gender,
            membershipExpiration: proposerExpirationTime,
            status: ProposerStatus.PendingEmailVerification,
            emailVerify: {
                create: {
                    code: hashEmailVerification,
                    expirationTime: emailVerificationCodeExpireTime,
                },
            },
        };

        if (payload.gender === Gender.Male) {
            newProposer.payments = {
                create: {
                    type: ProposerPaymentType.Initial,
                    value: proposalPrice,
                    status: PaymentStatus.Pending,
                },
            };
        }

        if (payload.referralCode != null) {
            const marketerSelect: Prisma.AffiliateMarketerWhereUniqueInput = {
                affiliateCode: payload.referralCode,
            };

            const aMarkerterId = await prisma.affiliateMarketer.findUnique({
                where: marketerSelect,
                select: {
                    id: true,
                },
            });

            if (aMarkerterId != null) {
                const marketerPaymentValue = proposalPrice / 10;

                newProposer.referredMarketer = {
                    create: {
                        marketerId: aMarkerterId.id,
                        paymentValue: marketerPaymentValue,
                        paymentStatus: PaymentStatus.Pending,
                    },
                };
            }
        }

        console.log(
            "{proposer-register} before create proposer : ",
            newProposer,
        );

        const createProposer = await prisma.proposer.create({
            data: newProposer,
        });

        console.log("{proposer-register} create proposer : ", createProposer);

        emailSender(
            payload.email,
            "Srisuba - Email verification",
            `your email verification code : ${emailVerifyCode}`,
        );

        const responseData: ApiResponse = {
            success: true,
            data: {
                email: createProposer.email,
            },
        };

        return res.status(201).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer-register} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
