const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Message = require('../models/Message');

router.get('/:room', auth, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { room, text, attachment } = req.body;
    const newMessage = new Message({
      sender: req.user.id,
      room,
      text,
      attachment
    });
    await newMessage.save();
    
    await newMessage.populate('sender', 'username avatar');
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:room', auth, async (req, res) => {
  try {
    await Message.deleteMany({ room: req.params.room });
    res.json({ message: 'Chat cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
