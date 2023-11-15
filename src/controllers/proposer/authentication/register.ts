import dayjs from "dayjs";
import { type Request, type Response } from "express";
import relativeTime from "dayjs/plugin/relativeTime";
import prisma from "../../../prismaClient/client";
import bcrypt from "bcrypt";
import { type Prisma } from "@prisma/client";
import { validationResult } from "express-validator";

dayjs.extend(relativeTime);

type registerPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    referralCode?: string;
};

export const register = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const payload: registerPayload = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const saltRound = 8;
        const hashPassword: string = await bcrypt.hash(
            payload.password,
            saltRound,
        );
        payload.password = hashPassword;

        let newProposer: Prisma.ProposerCreateInput;

        console.log(payload);

        // if (payload.referralCode) {
        //     newProposer = {

        //     }
        // } else {

        // }

        return res.status(201).send(payload);
        // return res.status(201).send(toResturant(newResturant))
    } catch (error) {
        console.log(`Unexpected Error : ${error}`);
        return res.status(500).send({ message: "system Error" });
    }
};
