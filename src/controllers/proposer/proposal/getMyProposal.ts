import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import { type FoodPreference } from "@prisma/client";

type ApiResponse = {
    success: boolean;
    data?: {
        profilePhoto: string;
        otherPictures: string[] | null;
        bioTitle: string | null;
        bioDescription: string | null;
        whatsAppNumber: string;
        ethnicity: string;
        religion: string;
        caste: string | null;
        civilStatus: string;
        height: string;
        country: string;
        stateOrDistrict: string;
        city: string;
        education: string;
        profession: string;
        drinking: boolean;
        smoking: boolean;
        foodPreference: FoodPreference;
        fatherEthnicity: string;
        fatherReligion: string;
        fatherCaste: string | null;
        fatherProfession: string | null;
        fatherCountryOfResidence: string;
        fatherAdditionalInfo: string | null;
        motherEthnicity: string;
        motherReligion: string;
        motherCaste: string | null;
        motherProfession: string | null;
        motherCountryOfResidence: string;
        motherAdditionalInfo: string | null;
        horoscopeMatching: boolean;
    };
    message?: string;
    errors?: ValidationError[];
};

export const getMyProposal = async (
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

        console.log("res locals", res.locals.proposerId);

        const proposerId: number | undefined = res.locals.proposerId;

        if (proposerId == null) {
            throw new Error("res local not have valid proposerId");
        }

        const proposal = await prisma.proposer.findUnique({
            where: {
                id: proposerId,
            },
            select: {
                proposal: {
                    select: {
                        profilePhoto: true,
                        otherPictures: true,
                        bioTitle: true,
                        bioDescription: true,
                        whatsAppNumber: true,
                        ethnicity: true,
                        religion: true,
                        caste: true,
                        civilStatus: true,
                        height: true,
                        country: true,
                        stateOrDistrict: true,
                        city: true,
                        education: true,
                        profession: true,
                        drinking: true,
                        smoking: true,
                        foodPreference: true,
                        fatherEthnicity: true,
                        fatherReligion: true,
                        fatherCaste: true,
                        fatherProfession: true,
                        fatherCountryOfResidence: true,
                        fatherAdditionalInfo: true,
                        motherEthnicity: true,
                        motherReligion: true,
                        motherCaste: true,
                        motherProfession: true,
                        motherCountryOfResidence: true,
                        motherAdditionalInfo: true,
                        horoscopeMatching: true,
                    },
                },
            },
        });

        console.log(
            "{proposer - getMyProposal} proposers response : ",
            proposal,
        );

        if (proposal?.proposal == null || proposal == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Proposal not found",
            };
            return res.status(404).send(responseData);
        }

        const responseData: ApiResponse = {
            success: true,
            data: proposal.proposal,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {proposer - getMyProposal} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
