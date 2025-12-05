// register api request..
exports.registerController = (req, res) => {
    console.log('Inside Register Controller');
    const { username, email, password } = req.body
    console.log(username, email, password );
    res.status(200).json("Request Received")
}
// loginapi
// usereditprofile
// admineditprofile