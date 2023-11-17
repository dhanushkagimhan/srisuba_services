import dayjs from "dayjs";
import bcrypt from "bcrypt";

const emailVerificationCode = async (): Promise<[string, string, Date]> => {
    const saltRound = 8;
    const emailVerifyCode: string = (Math.random() * 1000000)
        .toPrecision(6)
        .toString();

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
};

export default emailVerificationCode;
