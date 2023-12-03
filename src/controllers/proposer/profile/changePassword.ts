import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import bcrypt from "bcrypt";

type RequestPayload = {
    currentPassword: string;
    newPassword: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const changePassword = async (
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

        console.log("res locals", res.locals.proposerId);

        const proposerId: number | undefined = res.locals.proposerId;

        if (proposerId == null) {
            throw new Error("res local not have valid proposerId");
        }

        const payload: RequestPayload = req.body;

        const proposer = await prisma.proposer.findUnique({
            where: {
                id: proposerId,
            },
            select: {
                id: true,
                password: true,
            },
        });

        console.log("{proposer - changePassword} : ", proposer);

        if (proposer == null) {
            throw new Error("proposer not found");
        }

        const isMatch: boolean = bcrypt.compareSync(
            payload.currentPassword,
            proposer.password,
        );

        if (!isMatch) {
            const responseData: ApiResponse = {
                success: false,
                message: "current password is wrong",
            };
            return res.status(403).send(responseData);
        }

        const saltRound = 8;
        const hashPassword: string = await bcrypt.hash(
            payload.newPassword,
            saltRound,
        );

        const updatedProposer = await prisma.proposer.update({
            where: {
                id: proposerId,
            },
            data: {
                password: hashPassword,
            },
            select: {
                id: true,
                password: true,
            },
        });

        console.log(
            "{proposer - changePassword} password updated : ",
            updatedProposer,
        );

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer - changePassword} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
