import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes";
import prisma from "./utility/prismaClient/client";

const app: Application = express();
const PORT: string | number = process.env.PORT ?? 8080;

const corOptions = {
    origin: process.env.ALLOWED_ORIGIN ?? "https://www.srisuba.com",
    methods: "GET,PATCH,PUT,POST,DELETE",
};

app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from API Services!" });
});

app.use("/v1", router);

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("SIGINT received, gracefully shutting down");
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    console.log("SIGTERM received, gracefully shutting down");
    process.exit(0);
});

try {
    app.listen(PORT, () => {
        console.log(`Server is listening PORT: ${PORT}`);
    });
} catch (error: any) {
    console.log(`Error occurred: ${error.message}`);
}
