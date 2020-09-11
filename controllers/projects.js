const Projects = require('../models/projects');
const { errorResponse } = require('../helpers');
    
const getProjects = async (req, resp) => {
    const total = await Projects.countDocuments().exec().catch(() => null);
    if (!total) return errorResponse(resp, 400, 'No projects available');
    const selectors = {};
    const returnFields = 'name state autor createdAt updatedAt';
    const sortFields = { name: 1 };
    const autorPopulate = 'autor';
    const autorColumns = 'name email role state';
    Projects.find(selectors, returnFields).sort(sortFields).populate(autorPopulate, autorColumns).exec((error, projects) => {
        if (error) return errorResponse(resp, 500, error);
        resp.json({ ok: true, total, projects });
    });
};

const getProject = (req, resp) => {
    const selectors = { name: req.params.name };
    const returnFields = 'name state autor createdAt updatedAt';
    const sortFields = { name: 1 };
    const autorPopulate = 'autor';
    const autorColumns = 'name email role state';
    Projects.findOne(selectors, returnFields).sort(sortFields).populate(autorPopulate, autorColumns).exec((error, project) => {
        if (error) return errorResponse(resp, 500, error);
        if (!project) return errorResponse(resp, 400, 'Project not found');
        resp.json({ ok: true, project });
    });
};

const postProject = (req, resp) => {
    const { name } = req.body;
    new Projects({ name, autor: req.user._id }).save((error, project) => {
        if (error) return errorResponse(resp, 500, error);
        resp.json({ ok: true, project });
    });
};

const putProject = (req, resp) => {
    Projects.findByIdAndUpdate(req.params._id, { state: true, autor: req.user._id }, { new: true }, (error, project) => {
        if (error) return errorResponse(resp, 500, error);
        if (!project) return errorResponse(resp, 400, 'Project not found');
        resp.json({ ok: true, project });
    });
};

const deleteProject = (req, resp) => {
    Projects.findByIdAndUpdate(req.params._id, { state: false }, { new: true }, (error, project) => {
        if (error) return errorResponse(resp, 500, error);
        if (!project) return errorResponse(resp, 400, 'Project not found');
        resp.json({ ok: true, project });
    });
};

module.exports = { getProjects, getProject, postProject, putProject, deleteProject };