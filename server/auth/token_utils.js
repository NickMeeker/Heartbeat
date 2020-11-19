const jwt = require('jsonwebtoken');
const config = require('../config.json');

const secret = config.token.secret;

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, secret, (error) => {
            if (error) {
                res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            }

            next();
        });
    } else {
        res.status(403).send({
            success: true,
            message: 'No token provided'
        });
    }
};

const getTokenPayload = (token) => {
    const payload = jwt.decode(token, { complete: true }).payload;

    return payload;
};

const getUsernameFromToken = (token) => {
    const payload = getTokenPayload(token);

    return (payload) ? payload.username : null;
};

module.exports = { verifyToken, getUsernameFromToken };