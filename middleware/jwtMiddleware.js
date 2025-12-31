
const jwt = require('jsonwebtoken')
const jwtMiddleware = (req, res, next) => {
    console.log("Inside Middleware...");
    // logic to verify token
    // get token from req header
    const token = req.headers['authorization'].split(" ")[1]
    console.log(token);
    if (token) {
        try {
            const jwtResponse = jwt.verify(token, process.env.JWTSECRET)
            console.log(jwtResponse);
            req.payload = jwtResponse.userMail
            next()

        } catch (err) {
            res.status(401).json("Authoriztion failed..!!Invalid token")
        }
    } else {
        res.status(401).json("Authoriztion failed..!!Missing token")
    }
}
module.exports = jwtMiddleware