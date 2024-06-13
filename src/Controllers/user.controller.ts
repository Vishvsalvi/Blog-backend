import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

const prisma = new PrismaClient();

const createToken = (id: number) => {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: "10d",
    });

    return { accessToken, refreshToken };
};

// Create user
export const createUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, phoneNumber }: User = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phoneNumber }],
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists! Please login." });
        }

        const salt = await bcrypt.genSalt();
        const encodedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: encodedPassword,
                phoneNumber,
            },
        });

        const { accessToken, refreshToken } = createToken(newUser.id);
        const options = {httpOnly: true, secure: true}

        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(201).json({ newUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Sign in with email
export const signInUserWithEmail = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findFirst({ where: { email } });

        if (!existingUser) {
            return res.status(400).json({ message: "User doesn't exist! Please create a new account." });
        }

        const passCheck = await bcrypt.compare(password, existingUser.password);
        if (!passCheck) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const { accessToken, refreshToken } = createToken(existingUser.id);

        const options = {httpOnly: true, secure: true}

        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(200).json({ existingUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
