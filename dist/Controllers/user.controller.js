"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInUserWithEmail = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createToken = (id) => {
    const accessToken = jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10d",
    });
    return { accessToken, refreshToken };
};
// Create user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [{ email }, { phoneNumber }],
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists! Please login." });
        }
        const salt = yield bcrypt_1.default.genSalt();
        const encodedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: encodedPassword,
                phoneNumber,
            },
        });
        const { accessToken, refreshToken } = createToken(newUser.id);
        const options = { httpOnly: true, secure: true };
        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);
        return res.status(201).json({ newUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.createUser = createUser;
// Sign in with email
const signInUserWithEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield prisma.user.findFirst({ where: { email } });
        if (!existingUser) {
            return res.status(400).json({ message: "User doesn't exist! Please create a new account." });
        }
        const passCheck = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!passCheck) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const { accessToken, refreshToken } = createToken(existingUser.id);
        const options = { httpOnly: true, secure: true };
        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);
        return res.status(200).json({ existingUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.signInUserWithEmail = signInUserWithEmail;
