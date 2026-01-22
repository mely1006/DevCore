const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, getById, updateUser, removeUser, createUser } = require('../controllers/userController');

router.get('/', auth, getAll);
router.post('/', auth, createUser);
router.get('/:id', auth, getById);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, removeUser);

module.exports = router;
