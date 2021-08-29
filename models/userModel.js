const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: false,
        default: null,
    },
    age: {
        type: Number,
        required: false,
        default: null,
    },
    friends: {
        type: Array,
        required: false,
        default: [],
    },
    outgoingRequests: {
        type: Array,
        required: false,
        default: [],
    },
    incomingRequests: {
        type: Array,
        required: false,
        default: [],
    },
    games: {
        type: Array,
        required: false,
        default: [],
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
});
const UserModel = mongoose.model("users", UserSchema);
module.exports = { UserModel };
