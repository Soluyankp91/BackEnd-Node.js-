const express = require("express");
const AuthRouter = express.Router();
const { AuthService, signIn } = require("../services/AuthService");
const http_errors = require("http-errors");

AuthRouter.post("/register", (req, res) => {
    let { email, password } = req.body;
    AuthService(email, password)
        .then(() => {
            console.log("User created successfully");
            res.status(200).json({ message: "User created successfully" });
        })
        .catch((err) => {
            console.log("User was not created.Something went wrong");
            res.status(400).json({ message: err.message });
        });
});
AuthRouter.post("/login", (req, res, next) => {
    let { email, password } = req.body;
    signIn(email, password)
        .then((token) => {
            res.json({ jwt_token: token });
        })
        .catch((err) => {
            next(http_errors(400, err.message));
        });
});
module.exports = {
    AuthRouter,
};
