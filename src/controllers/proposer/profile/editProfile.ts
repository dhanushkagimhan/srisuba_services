import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type RequestPayload = {
    firstName: string;
    lastName: string;
    birthDay: Date;
};

type ApiResponse = {
    success: boolean;
    data?: {
        firstName: string;
        lastName: string;
        birthDay: Date;
    };
    message?: string;
    errors?: ValidationError[];
};

export const editProfile = async (
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

        const pBirthDay = new Date(payload.birthDay);

        const proposer = await prisma.proposer.update({
            where: {
                id: proposerId,
            },
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                birthDay: pBirthDay,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                birthDay: true,
            },
        });

        console.log("{proposer - editProfile} : ", proposer);

        if (proposer == null) {
            throw new Error("proposer not found");
        }

        const responseData: ApiResponse = {
            success: true,
            data: {
                firstName: proposer.firstName,
                lastName: proposer.lastName,
                birthDay: proposer.birthDay,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer - editProfile} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
