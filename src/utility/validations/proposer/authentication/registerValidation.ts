import dayjs from "dayjs";
import { checkExact, checkSchema } from "express-validator";
import prisma from "../../../prismaClient/client";

export const registerValidation = checkExact(
    checkSchema({
        email: {
            exists: {
                errorMessage: "email is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isEmail: { errorMessage: "Please provide valid email", bail: true },
            custom: {
                options: async (pEmail: string) => {
                    const exists = await prisma.proposer.count({
                        where: {
                            email: pEmail,
                        },
                    });

                    if (exists > 0) {
                        throw new Error("Email is already registered");
                    }
                },
            },
        },
        password: {
            exists: {
                errorMessage: "Password is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "password should be string",
                bail: true,
            },
            isLength: {
                options: { min: 8 },
                errorMessage: "Password should be at least 8 characters",
            },
        },
        firstName: {
            exists: {
                errorMessage: "firstName name is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "firstName should be string" },
        },
        lastName: {
            exists: {
                errorMessage: "lastName name is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "lastName should be string" },
        },
        gender: {
            exists: {
                errorMessage: "gender is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "Gender should be string", bail: true },
            isIn: {
                options: [["Male", "Female"]],
                errorMessage: "Gender is invalid",
            },
        },
        birthDay: {
            exists: {
                errorMessage: "birthDay is required (MM/DD/YYYY)",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "birthDay should be string (MM/DD/YYYY)",
                bail: true,
            },
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
                errorMessage:
                    "Age must be older than 18 years (format - MM/DD/YYYY)",
            },
        },
        referralCode: {
            optional: true,
            isString: { errorMessage: "referralCode should be string" },
        },
    }),
);
