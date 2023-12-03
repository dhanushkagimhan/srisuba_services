import dayjs from "dayjs";
import bcrypt from "bcrypt";

const emailVerificationCode = async (): Promise<[string, string, Date]> => {
    let emailVerifyCode: string;
    for (let i = 0; i < 5; i++) {
        emailVerifyCode = (Math.random() * 1000000).toPrecision(6);

        if (Number(emailVerifyCode) < 100000) {
            continue;
        }
        const saltRound = 8;
        const hashEmailVerification: string = await bcrypt.hash(
            emailVerifyCode,
            saltRound,
        );

        const emailVerificationCodeExpireTime: Date = dayjs()
            .add(5, "minute")
            .toDate();

        return [
            emailVerifyCode,
            hashEmailVerification,
            emailVerificationCodeExpireTime,
        ];
    }

    throw new Error("email verification code generation all 5 rounds failed");
};

export default emailVerificationCode;
