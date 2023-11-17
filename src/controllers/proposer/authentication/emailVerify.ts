import { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import { ProposerStatus } from "@prisma/client";
import proposerAccessTokenGenerate from "../../../utility/commonMethods/accessTokenGenerator";
import { Role } from "../../../utility/types";

type EmailVerifyPayload = {
    email: string;
    code: string;
};

type EmailVerifyResponse = {
    success: boolean;
    data: {
        accessToken: string;
    };
};

export const emailVerify = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const payload: EmailVerifyPayload = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "validation failed",
                errors: errors.array(),
            });
        }

        console.log("{proposer-email-verify} payload : ", payload);

        const proposerData = await prisma.proposer.findUnique({
            where: {
                email: payload.email,
            },
            select: {
                status: true,
                emailVerify: {
                    select: {
                        code: true,
                        expirationTime: true,
                    },
                },
            },
        });

        console.log("{proposer-email-verify} proposer data : ", proposerData);

        const codeExpirationTime = proposerData?.emailVerify?.expirationTime;
        const verifyCode = proposerData?.emailVerify?.code;

        if (codeExpirationTime == null || verifyCode == null) {
            return res.status(404).send({
                success: false,
                message: "Not found email verification data",
            });
        }

        const nowTime = new Date();

        if (nowTime > codeExpirationTime) {
            return res.status(410).send({
                success: false,
                message: "Email verification code expired",
            });
        }

        const isMatch: boolean = bcrypt.compareSync(payload.code, verifyCode);

        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invalid Email verification code",
            });
        }

        const proposerUpdate = await prisma.proposer.update({
            where: {
                email: payload.email,
            },
            data: {
                status: ProposerStatus.EmailVerified,
            },
            select: {
                id: true,
                status: true,
            },
        });

        console.log(
            "proposer update {proposer-email-verify} : ",
            proposerUpdate,
        );

        const pAccessToken = proposerAccessTokenGenerate(
            Role.Proposer,
            payload.email,
            proposerUpdate.id,
        );

        const responseData: EmailVerifyResponse = {
            success: true,
            data: {
                accessToken: pAccessToken,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer-email-verify} : ${error}`);
        return res
            .status(500)
            .send({ success: false, message: "system Error" });
    }
};
