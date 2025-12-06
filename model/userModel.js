const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pictures: {
        type: String,
        default: ""

    }, bio: {
        type: String,
        default: "Bookstore User"
    }, role: {
        type: String,
        default: "User"
    }
})

const users = mongoose.model("users", userSchema)

module.exports = users