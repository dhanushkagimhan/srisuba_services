import { type Request, type Response } from "express";
import proposalPriceGetter from "../../../utility/commonMethods/proposalPriceGetter";
import { type ValidationError, validationResult } from "express-validator";

type ApiResponse = {
    success: boolean;
    data?: {
        price: number;
    };
    message?: string;
    errors?: ValidationError[];
};

export const getProposalPrice = async (
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

        const proposalPrice = await proposalPriceGetter();

        const responseData: ApiResponse = {
            success: true,
            data: {
                price: proposalPrice,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {common-getProposalPrice} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
