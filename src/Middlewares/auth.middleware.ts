import { NextFunction, Request, Response } from 'express'
import jwt from "jsonwebtoken"
import { PrismaClient } from '@prisma/client'

interface JwtPayload {
    id: number;
    iat: number;
    exp: number;
  }

const prisma = new PrismaClient();

export const verifyJwt = async(req: Request, res: Response, next: NextFunction) => {
    const incomingToken =  req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
try {
    
        if(!incomingToken) {
            return res.status(401).json({message: "Access Token is missing!"})
        }
    
        const decodedToken = await jwt.verify(incomingToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
       
    
        const user = await prisma.user.findFirst({ where: {id: decodedToken.id} })
        

        if(!user){
            return res.status(401).json({
                message: "User not found"
            })
        }
    
        req.user = user;
        next();
} catch (error) {
    console.log(error)
    return res.status(500).json({message: "Something went wrong, please try again"})
}

}