const jwt = require('jsonwebtoken')
const secret = require('../api/secrets')


module.exports = (req, res, next) => {

    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
            if (err) {
                res.status(400).json({ message: 'cant pass' })
            } else {
                req.user = {
                    id: decodedToken.userId,
                    username: decodedToken.username,
                    role: decodedToken.role
                }
                next()
            }
        })
    } else {
        res.status(400).json({ message: 'no token' })
    }
}