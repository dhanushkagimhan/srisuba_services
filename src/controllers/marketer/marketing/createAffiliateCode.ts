import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type RequestPayload = {
    code: string;
};

type ApiResponse = {
    success: boolean;
    data?: {
        code: string;
    };
    message?: string;
    errors?: ValidationError[];
};

export const createAffiliateCode = async (
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

        console.log(
            "{marketer marketing createAffiliateCode} payload : ",
            payload,
        );

        console.log("res locals", res.locals.marketerId);

        const marketerId: number | undefined = res.locals.marketerId;

        if (marketerId == null) {
            throw new Error("res local not have valid marketerId");
        }

        const marketer = await prisma.affiliateMarketer.findUnique({
            where: {
                id: marketerId,
            },
            select: {
                affiliateCode: true,
            },
        });

        console.log(
            "{marketer marketing createAffiliateCode} found marketer data : ",
            marketer,
        );

        if (marketer == null) {
            throw new Error("Marketer not found");
        }

        if (marketer.affiliateCode != null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Affiliate code already created",
            };
            return res.status(460).send(responseData);
        }

        const otherMarketerExist = await prisma.affiliateMarketer.count({
            where: {
                affiliateCode: payload.code,
            },
        });

        console.log(
            "{marketer marketing createAffiliateCode} found other marketer count : ",
            otherMarketerExist,
        );

        if (otherMarketerExist > 0) {
            const responseData: ApiResponse = {
                success: false,
                message: "Affiliate code is taken, Try another.",
            };
            return res.status(461).send(responseData);
        }

        const createMarketerCode = await prisma.affiliateMarketer.update({
            where: {
                id: marketerId,
            },
            data: {
                affiliateCode: payload.code,
            },
            select: {
                id: true,
                email: true,
                affiliateCode: true,
            },
        });

        console.log(
            "{marketer marketing createAffiliateCode} created affiliate code for marketer : ",
            createMarketerCode,
        );

        if (createMarketerCode.affiliateCode == null) {
            throw new Error("Affiliate code creation is unsuccessful");
        }

        const responseData: ApiResponse = {
            success: true,
            data: {
                code: createMarketerCode.affiliateCode,
            },
        };

        return res.status(201).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {marketer marketing createAffiliateCode} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
