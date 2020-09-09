const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { enumMessage, uniqueMessage, requiredStringData, uniqueStringData, booleanData } = require('../constants');
const { normalStringData, enumStringData } = require('../helpers');

const validateName = {
    validator: value => /^[a-zA-Z ]{3,100}$/.test(value),
    message: props => `${ props.path } must only have letters between A to Z and have between 3 to 100 characters`
};

const validateEmail = {
    validator: value => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
    message: props => `${ props.path } must have a correct format of email addresses`
};

const validRoles = {
    values: ['User', 'Administrator'],
    message: `${ enumMessage } role`
};

const userSchema = new mongoose.Schema({
    name: normalStringData(requiredStringData, validateName),
    email: normalStringData(uniqueStringData, validateEmail),
    password: requiredStringData,
    role: enumStringData(requiredStringData, validRoles),
    state: booleanData
}, { timestamps: true });

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
}

userSchema.plugin(uniqueValidator, uniqueMessage);

module.exports = mongoose.model('user', userSchema);