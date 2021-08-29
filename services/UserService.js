const { UserModel } = require("../models/userModel");
const http_errors = require("http-errors");
const e = require("express");

const getUserProfileInfo = (userId) => {
    return UserModel.findOne({ _id: userId }).then((user) => {
        if (user) {
            return { age: user.age, login: user.login, email: user.email };
        } else {
            throw new http_errors(
                400,
                `There is no such user with id:${userId}`
            );
        }
    });
};
const changeProfileInfo = (userId, login, email, age) => {
    return UserModel.findOne({ _id: userId }).then((user) => {
        if (user) {
            return UserModel.findOne({ email: email }).then((isUser) => {
                console.log(isUser);
                if (isUser) {
                    throw new http_errors(
                        400,
                        `User with such email already exists.Email:${email}`
                    );
                } else {
                    user.login = login;
                    user.email = email;
                    user.age = age;
                    return user.save();
                }
            });
        } else {
            throw new http_errors(
                400,
                `There is no such user with id:${userId}`
            );
        }
    });
};
const sendInvite = (userId, friendId) => {
    return UserModel.findOne({ _id: userId }).then((currentUser) => {
        if (currentUser) {
            return UserModel.findOne({ _id: friendId }).then(
                (potentialFriend) => {
                    if (potentialFriend) {
                        if (
                            currentUser.outgoingRequests.indexOf(friendId) ===
                                -1 &&
                            potentialFriend.incomingRequests.indexOf(userId) ===
                                -1
                        ) {
                            currentUser.outgoingRequests.push(friendId);
                            potentialFriend.incomingRequests.push(userId);
                            return potentialFriend.save().then(() => {
                                return currentUser.save();
                            });
                        }
                    } else {
                        throw new http_errors(
                            400,
                            `There is no such user with id:${userId}`
                        );
                    }
                }
            );
        } else {
            throw new http_errors(
                400,
                `There is no such user with id:${userId}`
            );
        }
    });
};
const cancelInvite = (userId, friendId) => {
    return UserModel.findOne({ _id: userId }).then((currentUser) => {
        if (currentUser) {
            return UserModel.findOne({ _id: friendId }).then(
                (potentialFriend) => {
                    if (potentialFriend) {
                        let index_1 = currentUser.outgoingRequests.indexOf(
                            potentialFriend._id
                        );
                        let index_2 = potentialFriend.incomingRequests.indexOf(
                            currentUser._id
                        );
                        console.log(index_1, index_2);
                        if (index_1 !== -1 && index_2 !== -1) {
                            currentUser.outgoingRequests.splice(index_1, 1);
                            potentialFriend.incomingRequests.splice(index_2, 1);
                            return potentialFriend.save().then(() => {
                                return currentUser.save();
                            });
                        }
                    } else {
                        throw new http_errors(
                            400,
                            `There is no such user with id:${userId}`
                        );
                    }
                }
            );
        } else {
            throw new http_errors(
                400,
                `There is no such user with id:${userId}`
            );
        }
    });
};
const getAvailableFriends = (userId) => {
    return UserModel.findOne({ _id: userId }).then((user) => {
        return UserModel.find({
            _id: { $nin: [...user.friends, userId] },
        }).then(
            (arr) => {
                let array = [];
                arr.map((el) => {
                    if (user.outgoingRequests.indexOf(el._id) !== -1) {
                        array.push({
                            value: {
                                age: el.age,
                                _id: el._id,
                                email: el.email,
                                login: el.login,
                            },
                            sended: true,
                        });
                    } else {
                        array.push({
                            value: {
                                age: el.age,
                                _id: el._id,
                                email: el.email,
                                login: el.login,
                            },
                            sended: false,
                        });
                    }
                });
                return array;
            },
            (err) => {
                console.log(err.message);
            }
        );
    });
};
let acceptInvite = (userId, friendId) => {
    return UserModel.findOne({ _id: userId }).then((currentUser) => {
        if (currentUser) {
            return UserModel.findOne({ _id: friendId }).then(
                (potentialFriend) => {
                    if (potentialFriend) {
                        let i = currentUser.incomingRequests.indexOf(friendId);
                        console.log(currentUser.incomingRequests, friendId);
                        if (i !== -1) {
                            currentUser.incomingRequests.splice(i, 1);
                        } else {
                            throw new http_errors(
                                400,
                                `Something go really bad`
                            );
                        }
                        currentUser.friends.push(friendId);
                        let j =
                            potentialFriend.outgoingRequests.indexOf(userId);
                        if (j !== -1) {
                            potentialFriend.outgoingRequests.splice(j, 1);
                        } else {
                            throw new http_errors(
                                400,
                                `Something go really bad`
                            );
                        }
                        potentialFriend.friends.push(userId);
                        return potentialFriend.save().then(() => {
                            return currentUser.save();
                        });
                    } else {
                        throw new http_errors(
                            400,
                            `There is no such user with id:${userId}`
                        );
                    }
                }
            );
        } else {
            throw new http_errors(
                400,
                `There is no such user with id:${userId}`
            );
        }
    });
};
const getFriends = (userId) => {
    return UserModel.findOne({ _id: userId }).then((user) => {
        if (user) {
            return UserModel.find({ _id: { $in: [...user.friends] } }).then(
                (friends) => {
                    // console.log(friends);
                    let newArr = [];
                    for (let i = 0; i < friends.length; i++) {
                        newArr.push({
                            age: friends[i].age,
                            email: friends[i].email,
                            login: friends[i].login,
                            _id: friends[i]._id,
                        });
                    }
                    console.log(newArr);
                    return newArr;
                }
            );
        } else {
            throw new http_errors(
                400,
                `There is no such user with id:${userId}`
            );
        }
    });
};
const getIncomingRequests = (userId) => {
    return UserModel.findOne({ _id: userId }).then((user) => {
        if (user) {
            return UserModel.find({
                _id: { $in: [...user.incomingRequests] },
            }).then((incomingRequests) => {
                let newArr = [];
                for (let i = 0; i < incomingRequests.length; i++) {
                    newArr.push({
                        age: incomingRequests[i].age,
                        email: incomingRequests[i].email,
                        login: incomingRequests[i].login,
                        _id: incomingRequests[i]._id,
                    });
                }
                return newArr;
            });
        } else {
            throw new http_errors(
                400,
                `There is no such user with id:${userId}`
            );
        }
    });
};
const removeFriend = (userId, friendId) => {
    return UserModel.findOne({ _id: userId }).then((user) => {
        if (user) {
            return UserModel.findOne({ _id: friendId }).then((friend) => {
                if (friend) {
                    let i = user.friends.indexOf(friendId);
                    if (i !== -1) {
                        user.friends.splice(i, 1);
                    } else {
                        throw new http_errors(400, `Something go very wrong`);
                    }
                    let j = friend.friends.indexOf(userId);
                    if (j !== -1) {
                        friend.friends.splice(j, 1);
                    } else {
                        throw new http_errors(400, `Something go very wrong`);
                    }
                    return friend.save().then(() => {
                        return user.save();
                    });
                } else {
                    throw new http_errors(
                        400,
                        `There is no such user with id:${userId}`
                    );
                }
            });
        } else {
            throw new http_errors(
                400,
                `There is no such user with id:${userId}`
            );
        }
    });
};
module.exports = {
    removeFriend,
    getFriends,
    getIncomingRequests,
    acceptInvite,
    getAvailableFriends,
    getUserProfileInfo,
    changeProfileInfo,
    sendInvite,
    cancelInvite,
};
