import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface Blog {
    title: string
    description: string
    content: string
    coverImageUrl ?: string
    images?: string[]
    tags?: string[]
}

export const createBlog = async (req: Request, res: Response) => {
   try {
     const {title, description, content, coverImageUrl, images, tags}: Blog = req.body;
     const user = req.user;  
 
     if(!user){
       return res.status(404).json("User hasn't signed in, please sign in to publish!")
     }
     const userId = user.id;
 
     const newBlog = await prisma.blog.create({
       data: {
         title,
         description,
         content,
         coverImageUrl,
         authorId: userId,
         images,
         tags
       }
     });
 
     return res.status(200).json({message: "Blog published successfully!", newBlog})
   } catch (error) {

     console.log(error)
     return res.status(500).json({message: error})

   }
}