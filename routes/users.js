const express = require('express');
const { verifyToken, verifyActiveState, verifyAdminRole } = require('../middlewares/authentication');
const { getUsers, getUser, putUser, deleteUser } = require('../controllers/users');

const router = express.Router();

router.get('/users', verifyToken, verifyActiveState, getUsers);
router.get('/user/:email', verifyToken, verifyActiveState, getUser);
router.put('/user/:_id', verifyToken, verifyActiveState, verifyAdminRole, putUser);
router.delete('/user/:_id', verifyToken, verifyActiveState, verifyAdminRole, deleteUser);

module.exports = router;