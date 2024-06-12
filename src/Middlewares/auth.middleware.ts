import { NextFunction, Request, Response } from 'express'
import jwt from "jsonwebtoken"
import { PrismaClient } from '@prisma/client'
import './types/types.d.ts';

const prisma = new PrismaClient();

export const verifyJwt = async(req: Request, res: Response, next: NextFunction) => {
    const incomingToken =  req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!incomingToken) {
        return res.status(401).json({message: "Access Token is missing!"})
    }

    const decodedToken = await jwt.verify(incomingToken, process.env.ACCESS_TOKEN_SECRET as string);

    const user = await prisma.user.findFirst({
       where : {id: Number(decodedToken)}
    })

    if(!user){
        return res.status(401).json({
            message: "User not found"
        })
    }

    req.user = user;
    next();

}