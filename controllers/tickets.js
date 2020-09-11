const Users = require('../models/users');
const Projects = require('../models/projects');
const Tickets = require('../models/tickets');
const { errorResponse } = require('../helpers');

const getTickets = async (req, resp) => {
    const total = await Tickets.countDocuments().exec().catch(() => null);
    if (!total) return errorResponse(resp, 400, 'No tickets available');
    const selectors = {};
    const returnFields = 'number title description state informer responsable project createdAt updatedAt';
    const sortFields = { number: 1 };
    const informerPopulate = 'informer';
    const responsablePopulate = 'responsable';
    const userColumns = 'name email role state';
    const projectPopulate = 'project';
    const projectColumns = 'name state autor';
    Tickets
    .find(selectors, returnFields)
    .sort(sortFields)
    .populate(informerPopulate, userColumns)
    .populate(responsablePopulate, userColumns)
    .populate(projectPopulate, projectColumns)
    .exec((error, tickets) => {
        if (error) return errorResponse(resp, 500, error);
        resp.json({ ok: true, total, tickets });
    });
};

const getTicket = (req, resp) => {
    const selectors = { number: req.params.number.toUpperCase() };
    const returnFields = 'number title description state informer responsable project createdAt updatedAt';
    const sortFields = { number: 1 };
    const informerPopulate = 'informer';
    const responsablePopulate = 'responsable';
    const userColumns = 'name email role state';
    const projectPopulate = 'project';
    const projectColumns = 'name state autor';
    Tickets
    .findOne(selectors, returnFields)
    .sort(sortFields)
    .populate(informerPopulate, userColumns)
    .populate(responsablePopulate, userColumns)
    .populate(projectPopulate, projectColumns)
    .exec((error, ticket) => {
        if (error) return errorResponse(resp, 500, error);
        if (!ticket) return errorResponse(resp, 400, 'Ticket not found');
        resp.json({ ok: true, ticket });
    });
};

const postTicket = async (req, resp) => {
    const { title, description, responsable, project } = req.body;
    const responsableExist = await Users.findOne({ _id: responsable, state: true }).exec().catch(() => null);
    if (responsable && !responsableExist) return errorResponse(resp, 400, 'Responsable not found');
    const projectExist = await Projects.findOne({ _id: project, state: true }).exec().catch(() => null);
    if (!projectExist) return errorResponse(resp, 400, 'Project not found');
    const total = await Tickets.countDocuments().exec().catch(() => null);
    const { _id } = req.user;
    const number = `${ projectExist.name }-${ total + 1 }`;
    const body = { number, title, description, informer: _id, responsable: responsable || _id, project };
    new Tickets(body).save((error, ticket) => {
        if (error) return errorResponse(resp, 500, error);
        resp.json({ ok: true, ticket });
    });
};

const putTicket = async (req, resp) => {
    const responsableExist = await Users.findOne({ _id: req.body.responsable, state: true }).exec().catch(() => null);
    if (!responsableExist) return errorResponse(resp, 400, 'Responsable not found');
    const { title, description, state, responsable } = req.body;
    const body = { title, description, state, responsable };
    Tickets.findByIdAndUpdate(req.params._id, body, { new: true, runValidators: true }, (error, ticket) => {
        if (error) return errorResponse(resp, 500, error);
        if (!ticket) return errorResponse(resp, 400, 'Ticket not found');
        resp.json({ ok: true, ticket });
    });
};

module.exports = { getTickets, getTicket, postTicket, putTicket };