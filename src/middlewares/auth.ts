import { type Secret } from "jsonwebtoken";

export const SECRET_KEY: Secret =
    process.env.AUTH_SECRET_KEY ?? "fjiocdaECADG$53234498d4af";
