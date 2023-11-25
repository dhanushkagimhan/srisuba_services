import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const systemData: Prisma.SystemCreateInput = {
        name: "srisuba",
        adminEmail: process.env.ADMIN_EMAIL ?? "dhanushkagimhan@gmail.com",
        adminPassword: process.env.ADMIN_PASSWORD ?? "password",
        proposalPrice: 1500,
        systemIncomeBalance: 0,
        totalAffiliateMarketersCost: 0,
        totalSystemAccountBalance: 0,
    };

    const admin = await prisma.system.upsert({
        where: { name: "srisuba" },
        update: systemData,
        create: systemData,
    });
    console.log(admin);
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
