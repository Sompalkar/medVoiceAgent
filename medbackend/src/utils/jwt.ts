import jwt from "jsonwebtoken";
import { type Response } from "express";

const SECRET = process.env.JWT_SECRET || "secret";
const EXP = process.env.JWT_EXPIRY || "1h";


export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: EXP as any });
}



export function setTokenCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600 * 1000
  });
}


export function clearTokenCookie(res: Response) {
  res.cookie("jwt", "", { maxAge: 0 });
}
