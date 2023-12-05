import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";

type RequestPayload = {
    price: number;
};

type ApiResponse = {
    success: boolean;
    data?: {
        price: number;
    };
    message?: string;
    errors?: ValidationError[];
};

export const changeProposalPrice = async (
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

        console.log("{admin-changeProposalPrice} payload : ", payload);

        const systemUpdated = await prisma.system.update({
            where: {
                name: "srisuba",
            },
            data: {
                proposalPrice: payload.price,
            },
            select: {
                proposalPrice: true,
            },
        });

        console.log(
            "{Admin - changeProposalPrice} system updated data : ",
            systemUpdated,
        );

        const responseData: ApiResponse = {
            success: true,
            data: { price: systemUpdated.proposalPrice },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {admin-changeProposalPrice} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
