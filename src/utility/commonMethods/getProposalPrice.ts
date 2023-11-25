import prisma from "../prismaClient/client";

const getProposalPrice = async (): Promise<number> => {
    const proposalPrice = await prisma.system.findUnique({
        where: {
            name: "srisuba",
        },
        select: {
            proposalPrice: true,
        },
    });

    if (proposalPrice == null) {
        throw new Error("Couldn't find proposal price");
    }

    return proposalPrice.proposalPrice;
};

export default getProposalPrice;
