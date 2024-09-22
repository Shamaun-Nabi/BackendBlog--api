const jwt = require("jsonwebtoken");
const { getJwtExpirationTime } = require("../TokenChecker/ExpireToken")

const VerifyToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.send({
            msg: "You have to Give a Access Token"
        })
    }
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    getJwtExpirationTime(token)
    if (!token) {
        return res.send({
            msg: "You have to Give a Access Token"
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.send({
                msg: "Unauthorized"
            })
        }
        req.user = user
        next();
    })


}




module.exports = { VerifyToken }