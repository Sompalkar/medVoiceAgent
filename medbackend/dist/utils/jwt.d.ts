import { type Response } from "express";
export declare function signToken(userId: string): string;
export declare function setTokenCookie(res: Response, token: string): void;
export declare function clearTokenCookie(res: Response): void;
//# sourceMappingURL=jwt.d.ts.map