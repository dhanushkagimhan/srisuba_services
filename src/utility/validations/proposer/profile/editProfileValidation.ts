import dayjs from "dayjs";
import { checkExact, checkSchema } from "express-validator";

export const editProfileValidation = checkExact(
    checkSchema({
        firstName: {
            exists: {
                errorMessage: "firstName is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "firstName should be string" },
        },
        lastName: {
            exists: {
                errorMessage: "lastName is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: { errorMessage: "lastName should be string" },
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
    }),
);
