const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let AuthService = (email, password) => {
    return bcrypt.hash(password, 10).then((hashPassword) => {
        const user = new UserModel({
            email: email,
            password: hashPassword,
        });
        return user.save();
    });
};
let signIn = (email, password) => {
    return UserModel.findOne({ email: email }).then((user) => {
        if (!user) {
            throw new Error("Invalid login");
        }
        return bcrypt.compare(password, user.password).then((result) => {
            if (result) {
                const token = jwt.sign(
                    { email: user.email, _id: user._id },
                    "key"
                );
                return token;
            }
            throw new Error("Invalid password");
        });
    });
};
module.exports = {
    AuthService,
    signIn,
};
