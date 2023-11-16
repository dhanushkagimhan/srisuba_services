import dayjs from "dayjs";
import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";
import { type Prisma } from "@prisma/client";

export const registerValidation = checkExact(
    checkSchema({
        email: {
            isEmail: { bail: true, errorMessage: "Please provide valid email" },
            custom: {
                options: async (pEmail: string) => {
                    const proposerSelect: Prisma.ProposerWhereInput = {
                        email: pEmail,
                    };

                    const exists = await prisma.proposer.count({
                        where: proposerSelect,
                    });

                    if (exists > 0) {
                        throw new Error("Email is already registered");
                    }
                },
            },
        },
        password: {
            exists: { errorMessage: "Password is required" },
            isString: { errorMessage: "password should be string" },
            isLength: {
                options: { min: 8 },
                errorMessage: "Password should be at least 8 characters",
            },
        },
        firstName: {
            exists: {
                errorMessage: "firstName name is required",
                options: { checkFalsy: true },
            },
            isString: { errorMessage: "firstName should be string" },
        },
        lastName: {
            exists: {
                errorMessage: "lastName name is required",
                options: { checkFalsy: true },
            },
            isString: { errorMessage: "lastName should be string" },
        },
        gender: {
            isString: { errorMessage: "Gender should be string" },
            isIn: {
                options: [["Male", "Female"]],
                errorMessage: "Gender is invalid",
            },
        },
        birthDay: {
            isString: { errorMessage: "birthDay should be string" },
            custom: {
                options: (birthDay: string) => {
                    const dob = dayjs(birthDay);
                    const age = dayjs().diff(dob, "year");

                    if (age < 18) {
                        return false;
                    } else {
                        return true;
                    }
                },
                errorMessage: "Age must be older than 18 years",
            },
        },
        referralCode: {
            optional: true,
        },
    }),
);
