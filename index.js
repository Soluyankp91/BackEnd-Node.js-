const express = require("express");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const { AuthRouter } = require("../SteamBackend/routes/authRouter");
const { UserRouter } = require("../SteamBackend/routes/userRouter");

const http_errors = require("http-errors");

const app = express();
app.use(morgan("common"));
app.use(express.json());
app.use(cors());
app.use("/api/", AuthRouter);
app.use("/api/user/me", UserRouter);
mongoose
    .connect(
        "mongodb+srv://Sanya:456jkl89@cluster0.kggex.mongodb.net/Steam?retryWrites=true&w=majority",
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
    )
    .then(
        () => {
            console.log("Connected to db");
            app.listen(8080);
        },
        (err) => {
            console.log("Error connect to MongoDb", err);
        }
    );
app.use((req, res, next) => {
    next(http_errors(400, "Invalid path"));
});
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});
