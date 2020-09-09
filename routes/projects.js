const express = require('express');
const { verifyToken, verifyActiveState, verifyAdminRole } = require('../middlewares/authentication');
const { getProjects, getProject, postProject, putProject, deleteProject } = require('../controllers/projects');

const router = express.Router();
    
router.get('/projects', verifyToken, verifyActiveState, getProjects);
router.get('/project/:name', verifyToken, verifyActiveState, getProject);
router.post('/project', verifyToken, verifyActiveState, verifyAdminRole, postProject);
router.put('/project/:_id', verifyToken, verifyActiveState, verifyAdminRole, putProject);
router.delete('/project/:_id', verifyToken, verifyActiveState, verifyAdminRole, deleteProject);

module.exports = router;