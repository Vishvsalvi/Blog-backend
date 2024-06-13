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
exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const verifyJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const incomingToken = req.cookies.accessToken || ((_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", ""));
    try {
        if (!incomingToken) {
            return res.status(401).json({ message: "Access Token is missing!" });
        }
        const decodedToken = yield jsonwebtoken_1.default.verify(incomingToken, process.env.ACCESS_TOKEN_SECRET);
        const user = yield prisma.user.findFirst({ where: { id: decodedToken.id } });
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong, please try again" });
    }
});
exports.verifyJwt = verifyJwt;
