const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getAllUsers, deleteAccount, toggleArchiveChat } = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/', auth, getAllUsers);

router.delete('/account', auth, deleteAccount);
router.put('/archive', auth, toggleArchiveChat);

module.exports = router;
