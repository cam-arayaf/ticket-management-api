const jwt = require('jsonwebtoken');
const { errorResponse } = require('../helpers');

const verifyJwt = (token, req, resp, next) => {
    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) return errorResponse(resp, 401, error);
        req.user = decoded.user;
        next();
    });
}

const verifyActiveState = (req, resp, next) => {
    if (!req.user.state) return errorResponse(resp, 400, `This user isn't active`);
    next();
}

const verifyAdminRole = (req, resp, next) => {
    if (req.user.role !== 'Administrator') return errorResponse(resp, 400, `This user isn't Administrator`);
    next();
}

const verifyToken = (req, resp, next) => verifyJwt(req.get('token'), req, resp, next);

module.exports = { verifyActiveState, verifyAdminRole, verifyToken };