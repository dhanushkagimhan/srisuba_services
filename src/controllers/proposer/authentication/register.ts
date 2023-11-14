import dayjs from "dayjs";
import { type Request, type Response } from "express";
import relativeTime from "dayjs/plugin/relativeTime";
import prisma from "../../../prismaClient/client";
import bcrypt from "bcrypt";

dayjs.extend(relativeTime);

type registerPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDay: string;
};

export const register = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const payload: registerPayload = req.body;

        // validation

        const dob = dayjs(payload.birthDay);
        const age = dayjs().diff(dob, "year");

        if (age < 18) {
            return res
                .status(460)
                .send({ message: "Age must be older than 18 years" });
        }

        const exists = await prisma.proposer.count({
            where: { email: payload.email },
        });

        if (exists > 0) {
            return res
                .status(409)
                .send({ message: "Email is already registered" });
        }

        // creating proposer

        const saltRound = 8;
        const hashPassword: string = await bcrypt.hash(
            payload.password,
            saltRound,
        );
        payload.password = hashPassword;

        return res.status(201).send(payload);
        // return res.status(201).send(toResturant(newResturant))
    } catch (error) {
        console.log(`Unexpected Error : ${error}`);
        return res.status(500).send({ message: "system Error" });
    }
};
