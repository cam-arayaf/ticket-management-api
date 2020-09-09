const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { required, uniqueMessage, uniqueStringData, booleanData } = require('../constants');
const { normalStringData, objectIdData } = require('../helpers');

const Schema = mongoose.Schema;

const validateName = {
    validator: value => /^[a-zA-Z]{3,10}$/.test(value),
    message: props => `${ props.path } must only have letters between A to Z and have between 3 to 10 characters`
};

const projectSchema = new Schema({
    name: normalStringData({ ...uniqueStringData, ...{ uppercase: true } }, validateName),
    state: booleanData,
    autor: objectIdData(Schema, 'user', required)
}, { timestamps: true });

projectSchema.methods.toJSON = function() {
    const project = this.toObject();
    delete project.__v;
    return project;
}

projectSchema.plugin(uniqueValidator, uniqueMessage);

module.exports = mongoose.model('project', projectSchema);