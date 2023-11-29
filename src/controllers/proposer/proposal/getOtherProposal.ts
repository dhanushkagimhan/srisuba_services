import { type Request, type Response } from "express";
import prisma from "../../../utility/prismaClient/client";
import { type ValidationError, validationResult } from "express-validator";
import {
    type Gender,
    type FoodPreference,
    type MatchingProposalStatus,
} from "@prisma/client";

type ProposerResponse = {
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
    connection?: {
        status: MatchingProposalStatus;
    };
};

type ApiResponse = {
    success: boolean;
    data?: ProposerResponse;
    message?: string;
    errors?: ValidationError[];
};

export const getOtherProposal = async (
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

        const proposerId: number = Number(req.params.proposerId);

        console.log(`{admin-getProposal} proposerId : ${proposerId}`);

        const myProposerId: number | undefined = res.locals.proposerId;

        if (myProposerId == null) {
            throw new Error("res local not have valid proposerId");
        }

        if (myProposerId === proposerId) {
            throw new Error("Try to take own proposer with this API");
        }

        const myGender: Gender | undefined = res.locals.proposerGender;

        if (myGender == null) {
            throw new Error("res local not have valid proposerGender");
        }

        const proposal = await prisma.proposer.findUnique({
            where: {
                id: proposerId,
            },
            select: {
                gender: true,
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
                proposing: {
                    select: {
                        proposeReceiverId: true,
                        status: true,
                    },
                    where: { proposeReceiverId: myProposerId },
                },
                proposeReceiving: {
                    select: {
                        proposerId: true,
                        status: true,
                    },
                    where: { proposerId: myProposerId },
                },
            },
        });

        console.log("{Admin - getProposal} proposers response : ", proposal);

        if (proposal?.proposal == null || proposal == null) {
            const responseData: ApiResponse = {
                success: false,
                message: "Proposal not found",
            };
            return res.status(404).send(responseData);
        }

        if (proposal.gender === myGender) {
            throw new Error("try to take same gender proposal");
        }

        const proposerResponse: ProposerResponse = proposal.proposal;

        if (proposal.proposing.length === 1) {
            proposerResponse.connection = {
                status: proposal.proposing[0].status,
            };
        } else if (proposal.proposeReceiving.length === 1) {
            proposerResponse.connection = {
                status: proposal.proposeReceiving[0].status,
            };
        }

        const responseData: ApiResponse = {
            success: true,
            data: proposerResponse,
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(`Unexpected Error {admin-getProposal} : ${error}`);
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
