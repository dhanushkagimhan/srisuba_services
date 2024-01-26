import { type Request, type Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import prisma from "../../../utility/prismaClient/client";
import {
    type FoodPreference,
    ProposerStatus,
    type Prisma,
    Gender,
} from "@prisma/client";

type RequestPayload = {
    profilePhoto: string;
    otherPictures?: string[];
    bioTitle?: string;
    bioDescription?: string;
    whatsAppNumber: string;
    ethnicity: string;
    religion: string;
    caste?: string;
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
    fatherCaste?: string;
    fatherProfession?: string;
    fatherCountryOfResidence: string;
    fatherAdditionalInfo?: string;
    motherEthnicity: string;
    motherReligion: string;
    motherCaste?: string;
    motherProfession?: string;
    motherCountryOfResidence: string;
    motherAdditionalInfo?: string;
    horoscopeMatching: boolean;
};

type ApiResponse = {
    success: boolean;
    data?: {
        status: ProposerStatus;
    };
    message?: string;
    errors?: ValidationError[];
};

export const createOrUpdateProposal = async (
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

        const payload: RequestPayload = req.body;

        console.log("{proposer-createOrUpdateProposal} payload : ", payload);

        console.log("res locals", res.locals.proposerId);

        const proposerId: number | undefined = res.locals.proposerId;

        if (proposerId == null) {
            throw new Error("res local not have valid proposerId");
        }

        const proposer = await prisma.proposer.findUnique({
            where: {
                id: proposerId,
            },
            select: {
                status: true,
                gender: true,
            },
        });

        console.log(
            "found proposer data {createOrUpdateProposal} : ",
            proposer,
        );

        if (proposer == null) {
            throw new Error("proposer data not found");
        }

        if (
            proposer.status !== ProposerStatus.EmailVerified &&
            proposer.status !== ProposerStatus.Rejected &&
            proposer.status !== ProposerStatus.Banned &&
            proposer.status !== ProposerStatus.Active
        ) {
            const responseData: ApiResponse = {
                success: false,
                message: "proposer status is not support to this request",
            };
            return res.status(400).send(responseData);
        }

        const proposerUpdatingData: Prisma.ProposerUpdateInput = {
            proposal: {
                upsert: {
                    create: payload,
                    update: payload,
                },
            },
        };

        if (proposer.status === ProposerStatus.EmailVerified) {
            if (proposer.gender === Gender.Female) {
                proposerUpdatingData.status = ProposerStatus.PaymentApproved;
            } else {
                proposerUpdatingData.status = ProposerStatus.PendingPayment;
            }
        } else if (proposer.status === ProposerStatus.Rejected) {
            proposerUpdatingData.status = ProposerStatus.RejectionResolved;
        } else if (proposer.status === ProposerStatus.Banned) {
            proposerUpdatingData.status = ProposerStatus.BannedResolved;
        }

        const proposerUpdate = await prisma.proposer.update({
            where: {
                id: proposerId,
            },
            data: proposerUpdatingData,
            select: {
                id: true,
                email: true,
                status: true,
            },
        });

        console.log(
            "proposer update {proposer-createOrUpdateProposal} : ",
            proposerUpdate,
        );

        const responseData: ApiResponse = {
            success: true,
            data: {
                status: proposerUpdate.status,
            },
        };

        return res.status(200).send(responseData);
    } catch (error) {
        console.log(
            `Unexpected Error {proposer-createOrUpdateProposal} : ${error}`,
        );
        const responseData: ApiResponse = {
            success: false,
            message: "system Error",
        };
        return res.status(500).send(responseData);
    }
};
