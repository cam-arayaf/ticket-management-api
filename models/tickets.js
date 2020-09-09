const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { enumMessage, required, uniqueMessage, requiredStringData, uniqueStringData } = require('../constants');
const { normalStringData, enumStringData, objectIdData } = require('../helpers');

const Schema = mongoose.Schema;

const validateTitle = {
    validator: value => /^.{6,100}$/.test(value),
    message: props => `${ props.path } must be between 6 to 100 characters`
};

const validateDescription = {
    validator: value => /^.{6,}$/.test(value),
    message: props => `${ props.path } must be at least 6 characters`
};

const validStates = {
    values: ['To-Do', 'Development', 'Test', 'Pre-Production', 'Production', 'Rejected'],
    message: `${ enumMessage } state`
};

const ticketSchema = new Schema({
    number: uniqueStringData,
    title: normalStringData(requiredStringData, validateTitle),
    description: normalStringData(requiredStringData, validateDescription),
    state: enumStringData(requiredStringData, validStates),
    informer: objectIdData(Schema, 'user', required),
    responsable: objectIdData(Schema, 'user', required),
    project: objectIdData(Schema, 'project', required)
}, { timestamps: true });

ticketSchema.methods.toJSON = function() {
    const ticket = this.toObject();
    delete ticket.__v;
    return ticket;
}

ticketSchema.plugin(uniqueValidator, uniqueMessage);

module.exports = mongoose.model('ticket', ticketSchema);