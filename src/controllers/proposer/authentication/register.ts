import dayjs from "dayjs";
import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import { ProposerStatus, type Prisma, type Gender } from "@prisma/client";
import { validationResult } from "express-validator";
import emailTransporter from "../../../utility/emailSender/emailTransporter";

type RegisterPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    gender: Gender;
    referralCode?: string;
};

type RegisterResponse = {
    success: boolean;
    data: {
        email: string;
    };
};

export const register = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const payload: RegisterPayload = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "validation failed",
                errors: errors.array(),
            });
        }

        const saltRound = 8;
        const hashPassword: string = await bcrypt.hash(
            payload.password,
            saltRound,
        );

        const emailVerifyCode: string = (Math.random() * 1000000)
            .toPrecision(6)
            .toString();

        const hashEmailVerification: string = await bcrypt.hash(
            emailVerifyCode,
            saltRound,
        );

        const emailVeificationCodeExpireTime: Date = dayjs()
            .add(15, "minute")
            .toDate();

        const pBirthDay = new Date(payload.birthDay);

        const proposerExpirationTime = new Date();

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
                    expirationTime: emailVeificationCodeExpireTime,
                },
            },
        };

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
                newProposer.referredMarketer = {
                    create: {
                        marketerId: aMarkerterId.id,
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

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: "dhanushkagimhan@gmail.com",
            subject: "Srisuba - Email verification",
            text: `your email verification code : ${emailVerifyCode}`,
        };

        emailTransporter.sendMail(mailOptions, function (error, info) {
            if (error != null) {
                console.log(error);
            } else {
                console.log(
                    "{proposer-register} verification Email sent: " +
                        info.response,
                );
            }
        });

        const responseDate: RegisterResponse = {
            success: true,
            data: {
                email: createProposer.email,
            },
        };

        return res.status(201).send(responseDate);
    } catch (error) {
        console.log(`Unexpected Error {proposer-register} : ${error}`);
        return res
            .status(500)
            .send({ success: false, message: "system Error" });
    }
};
