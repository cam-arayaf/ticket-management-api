const express = require('express');
const { verifyToken, verifyActiveState } = require('../middlewares/authentication');
const { getTickets, getTicket, postTicket, putTicket } = require('../controllers/tickets');

const router = express.Router();

router.get('/tickets', verifyToken, verifyActiveState, getTickets);
router.get('/ticket/:number', verifyToken, verifyActiveState, getTicket);
router.post('/ticket', verifyToken, verifyActiveState, postTicket);
router.put('/ticket/:_id', verifyToken, verifyActiveState, putTicket);

module.exports = router;