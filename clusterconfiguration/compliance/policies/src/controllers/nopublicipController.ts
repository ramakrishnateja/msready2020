import { Request, Response, NextFunction } from "express";

export class NoPublicIpController {
    async validate(req: Request,res: Response, next:NextFunction) {
        console.log(`${JSON.stringify(req.body) }`);
        res.json().status(200);
    }
}