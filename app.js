const express = require('express');
const connectDB = require('./config/db');
const app = express();
require("dotenv").config()
const port = process.env.PORT || 4001;
const postRouter = require("./routes/posts");
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/auth');
const commentRouter = require('./routes/comments');

connectDB();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", postRouter)
app.use("/api", authRouter)
app.use("/api", commentRouter)

app.listen(port, () => console.log(`Server running on port ${port}`));
