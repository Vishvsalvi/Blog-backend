import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.use("/api", require("./Routes/user.routes"))
app.use("/api", require("./Routes/blog.routes"))


app.listen(port, () => console.log(`App is running on port ${port}`))