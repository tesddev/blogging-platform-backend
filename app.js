const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup( swaggerDocument ));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Swagger docs available at http://localhost:3000/api-docs');
});
