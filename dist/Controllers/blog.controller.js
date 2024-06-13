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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, content, coverImageUrl, images, tags } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(404).json("User hasn't signed in, please sign in to publish!");
        }
        const userId = user.id;
        const newBlog = yield prisma.blog.create({
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
        return res.status(200).json({ message: "Blog published successfully!", newBlog });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});
exports.createBlog = createBlog;
