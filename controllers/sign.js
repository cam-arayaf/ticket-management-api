const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { regexPassword, errorPassword } = require('../constants');
const { errorResponse } = require('../helpers');

const signUp = (req, resp) => {
    const { name, email, password, role } = req.body;
    if (!regexPassword.test(password)) return errorResponse(resp, 400, errorPassword);
    const newUser = new Users({ name, email, password: bcrypt.hashSync(password, 10), role });
    newUser.save((error, user) => {
        if (error) return errorResponse(resp, 500, error);
        resp.json({ ok: true, user });
    });
};

const signIn = (req, resp) => {
    const { email, password } = req.body;
    Users.findOne({ email, state: true }, (error, user) => {
        if (error) return errorResponse(resp, error);
        if (!user || !bcrypt.compareSync(password, user.password)) return errorResponse(resp, 400, 'Incorrect credentials');
        const token = jwt.sign({ user }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });
        resp.cookie('token', token);
        resp.json({ ok: true, token, user });
    });
};

const signOut = (req, resp) => {
    if (!req.cookies.token) return errorResponse(resp, 400, `There isn't any user with active session`);
    resp.clearCookie('token');
    resp.json({ ok: true, message: 'Sign out successful' });
};

module.exports = { signUp, signIn, signOut };