import { type Request, type Response } from "express";
import proposalPriceGetter from "../../../utility/commonMethods/proposalPriceGetter";

type ApiResponse = {
    success: boolean;
    data?: {
        price: number;
    };
    message?: string;
};

export const getProposalPrice = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
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
