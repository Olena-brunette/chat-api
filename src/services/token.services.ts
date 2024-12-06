import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.JWT_SECRET || "access_secret";
const refreshTokenSecret = process.env.REFRESH_JWT_SECRET || "refresh_secret";

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, accessTokenSecret, { expiresIn: "1h" });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: "30d" });
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, accessTokenSecret);
    } catch (error) {
        throw new Error("Invalid or expired access token");
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, refreshTokenSecret);
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
};
