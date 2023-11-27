import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import bcrypt from "bcrypt";
import { type ProposerStatus } from "@prisma/client";
import { type ValidationError, validationResult } from "express-validator";
import proposerAccessTokenGenerate from "../../../utility/commonMethods/accessTokenGenerator";
import { Role } from "../../../utility/types";

type RequestPayload = {
    email: string;
    password: string;
};

type ApiResponse = {
    success: boolean;
    data?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        accessToken: string;
        status: ProposerStatus;
        membershipExpiration: Date;
    };
    message?: string;
    errors?: ValidationError[];
};

export const login = async (req: Request, res: Response): Promise<Response> => {
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

        console.log("{proposer-login} payload : ", payload);

        const proposer = await prisma.proposer.findUnique({
            where: {
                email: payload.email,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                password: true,
                status: true,
                membershipExpiration: true,
            },
        });

        console.log("{proposer-login} found proposer data : ", proposer);

        if (proposer == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Email is not registered",
            };
            return res.status(404).send(responseData);
        }

        const isMatch: boolean = bcrypt.compareSync(
            payload.password,
            proposer.password,
        );

        if (!isMatch) {
            const responseData: ApiResponse = {
                success: false,
                message: "Password is wrong",
            };
            return res.status(401).send(responseData);
        }

        const pAccessToken = proposerAccessTokenGenerate(
            Role.Proposer,
            payload.email,
            proposer.id,
        );

        const responseData: ApiResponse = {
            success: true,
            data: {
                id: proposer.id,
                email: payload.email,
                firstName: proposer.firstName,
                lastName: proposer.lastName,
                status: proposer.status,
                membershipExpiration: proposer.membershipExpiration,
                accessToken: pAccessToken,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer-login} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
