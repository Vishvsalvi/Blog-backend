"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use((0, cookie_parser_1.default)());
app.use("/api", require("./Routes/user.routes"));
app.use("/api", require("./Routes/blog.routes"));
app.listen(port, () => console.log(`App is running on port ${port}`));
