// register api request..
const users = require('../model/userModel')
const jwt = require('jsonwebtoken')

exports.registerController = async (req, res) => {
    console.log('Inside Register Controller');
    const { username, email, password } = req.body
    console.log(username, email, password);
    // res.status(200).json("Request Received")
    try {
        // check mail in user
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(409).json("User Already exist!! Please Login..")

        } else {
            const newUser = new users({
                username, email, password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (err) {
        console.log(err);

        res.status(500).json(err)

    }
}


// loginapi

exports.loginController = async (req, res) => {
    console.log('Inside Login Controller');
    const { email, password } = req.body
    console.log(email, password);
    try {
        // check mail in user
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (password == existingUser.password) {
                // generete
                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSECRET)
                res.status(200).json({ user: existingUser, token })
            } else {

                res.status(401).json("Incorrect Email/password")
            }

        } else {
            res.status(401).json("Account does not exist !!!")

        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)

    }
}
// google
exports.googleController = async (req, res) => {
    console.log('Google Login Controller');
    const { email, password, username, pictures } = req.body
    console.log(email, password, username, pictures);
    try {
        // check mail in user
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            // login
            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSECRET)
            res.status(200).json({ user: existingUser, token })

        } else {
            // register
            const newUser = await users.create({
                username, email, password, pictures
            })
            const token = jwt.sign({ userMail: newUser.email, role: newUser.role }, process.env.JWTSECRET)
            res.status(200).json({ user: newUser, token })

        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)

    }
}
// usereditprofile
exports.updateUserProfileController = async (req, res) => {
    console.log("Inside Update User Profile Controller");
    const { id } = req.params
    const email = req.payload
    const { username, password, role, bio, pictures } = req.body
    const uploadImg = req.file ? req.file.filename : pictures
    console.log(id, username, password, role, bio, uploadImg);
    try {
        const updateUser = await users.findByIdAndUpdate({ _id: id }, { username, email, password, pictures: uploadImg, bio, role }, { new: true })
        res.status(200).json(updateUser)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

}
// admineditprofile

// getallusers
exports.getAllUsersController = async (req, res) => {
    console.log('Inside getAllUsersController ');
    const role = req.role
    try {
        const allUsers = await users.find({ role: { $ne: "admin" } })
        res.status(200).json(allUsers)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)

    }
}