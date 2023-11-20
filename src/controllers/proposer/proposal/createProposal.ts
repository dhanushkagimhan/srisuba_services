import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import { ProposerStatus } from "@prisma/client";

type RequestPayload = {
    profilePhoto: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
};

export const createProposal = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const payload: RequestPayload = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const responseData: ApiResponse = {
                success: false,
                message: "validation failed",
                errors: errors.array(),
            };
            return res.status(400).send(responseData);
        }

        console.log("{proposer-createProposal} payload : ", payload);

        console.log("res locals", res.locals.proposerId);

        // const proposerUpdate = await prisma.proposer.update({
        //     where: {
        //         email: payload.email,
        //     },
        //     data: {
        //         status: ProposerStatus.EmailVerified,
        //     },
        //     select: {
        //         id: true,
        //         status: true,
        //     },
        // });

        // console.log(
        //     "proposer update {proposer-createProposal} : ",
        //     proposerUpdate,
        // );

        const responseData: ApiResponse = {
            success: true,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer-createProposal} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
