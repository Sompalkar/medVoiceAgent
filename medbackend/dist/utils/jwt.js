import jwt from "jsonwebtoken";
import {} from "express";
const SECRET = process.env.JWT_SECRET || "secret";
const EXP = process.env.JWT_EXPIRY || "1h";
export function signToken(userId) {
    return jwt.sign({ sub: userId }, SECRET, { expiresIn: EXP });
}
export function setTokenCookie(res, token) {
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 1000
    });
}
export function clearTokenCookie(res) {
    res.cookie("jwt", "", { maxAge: 0 });
}
//# sourceMappingURL=jwt.js.map