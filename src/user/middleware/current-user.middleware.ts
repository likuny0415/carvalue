import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { UserService } from "../user.service";


declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(
        private userService: UserService
    ) {}

    async use(req: any, res: any, next: NextFunction) {
        const { userId }  = req.session || {}
        if (userId) {
            const user = await this.userService.findOne(userId);
            req.currentUser = user
        }   

        next()
    }
    
}