import express from 'express';
import { createBlog } from '../Controllers/blog.controller';
import { verifyJwt } from '../Middlewares/auth.middleware';

const router = express.Router();

router.route("/createBlog").post(verifyJwt, createBlog);

module.exports = router