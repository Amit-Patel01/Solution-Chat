const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createRoom, joinRoom, getMyRooms, deleteRoom, leaveRoom } = require('../controllers/roomController');

router.post('/create', auth, createRoom);
router.post('/join', auth, joinRoom);
router.get('/my-rooms', auth, getMyRooms);

router.delete('/name/:name', auth, deleteRoom);
router.post('/leave', auth, leaveRoom);

module.exports = router;
