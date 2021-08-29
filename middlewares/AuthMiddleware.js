const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Provide auth header" });
    }
    let token = authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Pls include token" });
    }
    try {
        const tokenPaylaod = jwt.verify(token, "key");
        req.user = {
            _id: tokenPaylaod._id,
            email: tokenPaylaod.email,
        };
        next();
    } catch (err) {
        console.log(err.message);
        res.status(401).json({ message: err.message });
    }
};
module.exports = {
    authMiddleware,
};
