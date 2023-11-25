import nodemailer from "nodemailer";

const emailSender = (toEmail: string, eSubject: string, eText: string) => {
    const emailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: toEmail,
        subject: eSubject,
        text: eText,
    };

    emailTransporter.sendMail(mailOptions, function (error, info) {
        if (error != null) {
            console.log("Error in email sending : ", error);
        } else {
            console.log("{Email sent: " + info.response);
        }
    });
};

export default emailSender;
