import { type Request, type Response, type NextFunction } from "express";
import prisma from "../../utility/prismaClient/client";
import { ProposerStatus } from "@prisma/client";

type ApiResponse = {
    success: boolean;
    message: string;
};

export const membershipActiveChecker = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | undefined> => {
    try {
        const proposerId: number | undefined = res.locals.proposerId;

        if (proposerId == null) {
            throw new Error("res local not have valid proposerId");
        }

        const proposer = await prisma.proposer.findUnique({
            where: {
                id: proposerId,
            },
            select: {
                gender: true,
                status: true,
                membershipExpiration: true,
            },
        });

        if (proposer == null) {
            throw new Error("Not found proposer");
        }

        if (
            proposer.status !== ProposerStatus.Active ||
            proposer.membershipExpiration < new Date()
        ) {
            throw new Error(
                `Membership is not valid (proposer.status: ${
                    proposer.status
                }, proposer.membershipExpiration: ${proposer.membershipExpiration.toString()})`,
            );
        }

        res.locals.proposerGender = proposer.gender;

        next();
    } catch (err) {
        console.log(
            "{membershipActiveChecker Middleware} membership active checking error : ",
            err,
        );

        const response: ApiResponse = {
            success: false,
            message: "Invalid membership",
        };
        return res.status(403).send(response);
    }
};
