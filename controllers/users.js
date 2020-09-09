const bcrypt = require('bcrypt');
const Users = require('../models/users');
const { regexPassword, errorPassword } = require('../constants');
const { errorResponse } = require('../helpers');
    
const getUsers = async (req, resp) => {
    const total = await Users.countDocuments().exec();
    if (!total) return errorResponse(resp, 400, 'No users available');
    const selectors = {};
    const returnFields = 'name email role state createdAt updatedAt';
    const sortFields = { email: 1 }; 
    Users.find(selectors, returnFields).sort(sortFields).exec((error, users) => {
        if (error) return errorResponse(resp, 500, error);
        resp.json({ ok: true, total, users });
    });
};

const getUser = (req, resp) => {
    const selectors = { email: req.params.email };
    const returnFields = 'name email role state createdAt updatedAt';
    const sortFields = { email: 1 };
    Users.findOne(selectors, returnFields).sort(sortFields).exec((error, user) => {
        if (error) return errorResponse(resp, 500, error);
        if (!user) return errorResponse(resp, 400, 'User not found');
        resp.json({ ok: true, user });
    });
};

const putUser = (req, resp) => {
    const { password, role } = req.body;
    if (!regexPassword.test(password)) return errorResponse(resp, 400, errorPassword);
    const body = { password: bcrypt.hashSync(password, 10), role, state: true };
    Users.findByIdAndUpdate(req.params._id, body, { new: true, runValidators: true }, (error, user) => {
        if (error) return errorResponse(resp, 500, error);
        if (!user) return errorResponse(resp, 400, 'User not found');
        resp.json({ ok: true, user });
    });
};

const deleteUser = (req, resp) => {
    Users.findByIdAndUpdate(req.params._id, { state: false }, { new: true }, (error, user) => {
        if (error) return errorResponse(resp, 500, error);
        if (!user) return errorResponse(resp, 400, 'User not found');
        resp.json({ ok: true, user });
    });
};

module.exports = { getUsers, getUser, putUser, deleteUser };