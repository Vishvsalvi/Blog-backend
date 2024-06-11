import express from "express"
import {createUser, signInUserWithEmail} from "../Controllers/user.controller"

const router = express.Router();

router.route("/signup").post(createUser)
router.route("/signin").post(signInUserWithEmail)

module.exports = router