import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type RequestPayload = {
    firstName: string;
    lastName: string;
    country: string;
};

type ApiResponse = {
    success: boolean;
    data?: {
        firstName: string;
        lastName: string;
        country: string;
    };
    message?: string;
    errors?: ValidationError[];
};

export const marketerEditProfile = async (
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

        console.log("res locals", res.locals.marketerId);

        const marketerId: number | undefined = res.locals.marketerId;

        if (marketerId == null) {
            throw new Error("res local not have valid marketerId");
        }

        const payload: RequestPayload = req.body;

        console.log("{marketerEditProfile} payload : ", payload);

        const marketer = await prisma.affiliateMarketer.update({
            where: {
                id: marketerId,
            },
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                country: payload.country,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                country: true,
            },
        });

        console.log("{marketerEditProfile} : ", marketer);

        const responseData: ApiResponse = {
            success: true,
            data: {
                firstName: marketer.firstName,
                lastName: marketer.lastName,
                country: marketer.country,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {marketerEditProfile} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
