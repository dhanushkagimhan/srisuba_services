import { FoodPreference } from "@prisma/client";
import { checkExact, checkSchema } from "express-validator";

export const createOrUpdateProposalValidation = checkExact(
    checkSchema({
        profilePhoto: {
            exists: {
                errorMessage: "profilePhoto is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "profilePhoto should be string",
            },
        },
        otherPictures: {
            optional: true,
            custom: {
                options: async (otherPictures: string[]) => {
                    if (otherPictures.length > 5) {
                        throw new Error("can add 5 other pictures only");
                    }
                },
            },
        },
        bioTitle: {
            optional: true,
            isString: {
                errorMessage: "bioTitle should be string",
            },
        },
        bioDescription: {
            optional: true,
            isString: {
                errorMessage: "bioDescription should be string",
            },
        },
        whatsAppNumber: {
            exists: {
                errorMessage: "whatsAppNumber is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "whatsAppNumber should be string",
            },
        },
        ethnicity: {
            exists: {
                errorMessage: "ethnicity is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "ethnicity should be string",
            },
        },
        religion: {
            exists: {
                errorMessage: "religion is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "religion should be string",
            },
        },
        caste: {
            optional: true,
            isString: {
                errorMessage: "caste should be string",
            },
        },
        civilStatus: {
            exists: {
                errorMessage: "civilStatus is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "civilStatus should be string",
            },
        },
        height: {
            exists: {
                errorMessage: "height is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "height should be string",
            },
        },
        country: {
            exists: {
                errorMessage: "country is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "country should be string",
            },
        },
        stateOrDistrict: {
            exists: {
                errorMessage: "stateOrDistrict is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "stateOrDistrict should be string",
            },
        },
        city: {
            exists: {
                errorMessage: "profilePhoto is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "profilePhoto should be string",
            },
        },
        education: {
            exists: {
                errorMessage: "profilePhoto is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "profilePhoto should be string",
            },
        },
        profession: {
            exists: {
                errorMessage: "profilePhoto is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "profilePhoto should be string",
            },
        },
        drinking: {
            exists: {
                errorMessage: "drinking is required",
                bail: true,
            },
            isBoolean: {
                errorMessage: "drinking should be boolean",
            },
        },
        smoking: {
            exists: {
                errorMessage: "smoking is required",
                bail: true,
            },
            isBoolean: {
                errorMessage: "smoking should be boolean",
            },
        },
        foodPreference: {
            exists: {
                errorMessage: "foodPreference is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "foodPreference should be string",
            },
            custom: {
                options: (foodPreference) => {
                    if (
                        foodPreference !== FoodPreference.NonVegetarian &&
                        foodPreference !== FoodPreference.Vegetarian &&
                        foodPreference !== FoodPreference.Vegan
                    ) {
                        throw new Error("Invalid food preference");
                    } else {
                        return true;
                    }
                },
            },
        },
        fatherEthnicity: {
            exists: {
                errorMessage: "fatherEthnicity is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "fatherEthnicity should be string",
            },
        },
        fatherReligion: {
            exists: {
                errorMessage: "fatherReligion is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "fatherReligion should be string",
            },
        },
        fatherCaste: {
            optional: true,
            isString: {
                errorMessage: "fatherCaste should be string",
            },
        },
        fatherProfession: {
            optional: true,
            isString: {
                errorMessage: "fatherProfession should be string",
            },
        },
        fatherCountryOfResidence: {
            exists: {
                errorMessage: "fatherCountryOfResidence is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "fatherCountryOfResidence should be string",
            },
        },
        fatherAdditionalInfo: {
            optional: true,
            isString: {
                errorMessage: "fatherAdditionalInfo should be string",
            },
        },
        motherEthnicity: {
            exists: {
                errorMessage: "motherEthnicity is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "motherEthnicity should be string",
            },
        },
        motherReligion: {
            exists: {
                errorMessage: "motherReligion is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "motherReligion should be string",
            },
        },
        motherCaste: {
            optional: true,
            isString: {
                errorMessage: "motherCaste should be string",
            },
        },
        motherProfession: {
            optional: true,
            isString: {
                errorMessage: "motherProfession should be string",
            },
        },
        motherCountryOfResidence: {
            exists: {
                errorMessage: "motherCountryOfResidence is required",
                options: { checkFalsy: true },
                bail: true,
            },
            isString: {
                errorMessage: "motherCountryOfResidence should be string",
            },
        },
        motherAdditionalInfo: {
            optional: true,
            isString: {
                errorMessage: "motherAdditionalInfo should be string",
            },
        },
        horoscopeMatching: {
            exists: {
                errorMessage: "horoscopeMatching is required",
                bail: true,
            },
            isBoolean: {
                errorMessage: "horoscopeMatching should be boolean",
            },
        },
    }),
);
