import nodemailer from "nodemailer";

const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

console.log(process.env.EMAIL_ADDRESS);

export default emailTransporter;
