const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createRoom = async (req, res) => {
  try {
    const { name, password } = req.body;
    const existing = await Room.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Room name already taken' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const room = new Room({
      name,
      password: hashedPassword,
      creator: req.user.id,
      participants: [req.user.id]
    });
    await room.save();

    const userAcc = await User.findById(req.user.id);
    const sysMsg = new Message({
       sender: req.user.id,
       room: room.name,
       text: `${userAcc.username} created the room! Welcome! 🎉`,
       isSystemMessage: true
    });
    await sysMsg.save();

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { name, password } = req.body;
    const room = await Room.findOne({ name });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isMatch = await bcrypt.compare(password, room.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    if (!room.participants.includes(req.user.id)) {
      room.participants.push(req.user.id);
      await room.save();
      
      const userAcc = await User.findById(req.user.id);
      const sysMsg = new Message({
         sender: req.user.id,
         room: room.name,
         text: `${userAcc.username} has joined the room! Welcome! 🎉`,
         isSystemMessage: true
      });
      await sysMsg.save();
      const populatedMsg = await sysMsg.populate('sender', 'username avatar');
      req.app.get('socketio').to(room.name).emit('receive_message', { room: room.name, message: populatedMsg });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ participants: req.user.id });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ name: req.params.name });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    
    if (room.creator.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Only the creator can delete this room' });
    }
    
    await Room.findOneAndDelete({ name: req.params.name });
    await Message.deleteMany({ room: req.params.name });
    res.json({ message: 'Room deleted successfully' });
  } catch(error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.leaveRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const room = await Room.findOne({ name });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    
    room.participants = room.participants.filter(p => p.toString() !== req.user.id);
    await room.save();
    res.json({ message: 'Left room successfully' });
  } catch(error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
