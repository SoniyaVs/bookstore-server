// register api request..
const users = require('../model/userModel')
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
        res.status(500).json(err)

    }
}
// loginapi
// usereditprofile
// admineditprofile