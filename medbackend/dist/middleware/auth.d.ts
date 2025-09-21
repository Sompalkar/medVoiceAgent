import { type Request, type Response, type NextFunction } from "express";
export default function auth(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.d.ts.map