const express = require("express");
const UserRouter = express.Router();
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { UserModel } = require("../models/userModel");
const {
    getAvailableFriends,
    getUserProfileInfo,
    changeProfileInfo,
    sendInvite,
    cancelInvite,
    acceptInvite,
    removeFriend,
    getFriends,
    getIncomingRequests,
} = require("../services/UserService");

UserRouter.use(authMiddleware);
UserRouter.get("/", (req, res) => {
    const { _id } = req.user;
    getUserProfileInfo(_id).then((user) => {
        let { age, login, email } = user;
        res.status(200).json({
            user: {
                age: age,
                login: login,
                email: email,
            },
        });
    });
});
UserRouter.get("/friends", (req, res) => {
    const { _id } = req.user;
    getFriends(_id).then(
        (friends) => {
            res.status(200).json(friends);
        },
        (err) => {
            res.status(400).json({ message: err.message });
        }
    );
});
UserRouter.get("/incomingRequests", (req, res) => {
    const { _id } = req.user;
    getIncomingRequests(_id).then(
        (incoming) => {
            res.status(200).json(incoming);
        },
        (err) => {
            res.status(400).json({ message: err.message });
        }
    );
});
UserRouter.get("/availableFriends", (req, res) => {
    let { _id } = req.user;
    getAvailableFriends(_id).then((arr) => {
        res.status(200).json(arr);
    });
});
UserRouter.post("/profileChange", (req, res) => {
    const { _id } = req.user;
    const { login, age, email } = req.body;
    console.log(_id);
    changeProfileInfo(_id, login, email, age).then(
        (user) => {
            res.status(200).json({
                login: user.login,
                email: user.email,
                age: user.age,
            });
        },
        (err) => {
            console.log(err.message);
            res.status(400).json({ message: "Something went bad" });
        }
    );
});
UserRouter.post("/acceptInvite", (req, res) => {
    const { _id } = req.user;
    const { friendId } = req.body;
    acceptInvite(_id, friendId).then(
        () => {
            res.status(200).json({ message: "success" });
        },
        (err) => {
            res.status(400).json({ message: err.message });
        }
    );
});
UserRouter.post("/sendInvite", (req, res) => {
    const { _id } = req.user;
    const { friendId } = req.body;
    sendInvite(_id, friendId).then(
        () => {
            res.send({ message: "success" });
        },
        (err) => {
            console.log(err.message);
        }
    );
});
UserRouter.post("/cancelInvite", (req, res) => {
    const { _id } = req.user;
    const { friendId } = req.body;
    cancelInvite(_id, friendId).then(
        () => {
            res.send({ message: "success" });
        },
        (err) => {
            console.log(err.message);
        }
    );
});
UserRouter.delete("/removeFriend/:id", (req, res) => {
    const { _id } = req.user;
    const friendId = req.params.id;
    removeFriend(_id, friendId).then(
        () => {
            res.status(200).json({ message: "success" });
        },
        (err) => {
            res.status(400).json({ message: err.message });
        }
    );
});
module.exports = { UserRouter };
