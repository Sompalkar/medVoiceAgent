import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET = process.env.JWT_SECRET || "secret";


export default async function auth(req: Request, res: Response, next: NextFunction) {
  try { 
     
    let token = req.cookies?.jwt as string | undefined;

    if (!token) {
      const authz = req.headers["authorization"] as string | undefined;
      if (authz && authz.startsWith("Bearer ")) token = authz.slice("Bearer ".length);
    }


    if (!token) {
      
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload: any = jwt.verify(token, SECRET as any);

       const user = await User.findById(payload.sub);

        if (!user) {
          
          return res.status(401).json({ message: "Token invalid" });
        }


    (req as any).user = user;

    return next();

  } catch (err) {

    return res.status(401).json({ message: "Auth error" });


  }
}
