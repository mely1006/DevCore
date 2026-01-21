const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, getById, create, remove, getStudents } = require('../controllers/promotionController');

router.get('/', auth, getAll);
router.post('/', auth, create);
router.get('/:id', auth, getById);
router.delete('/:id', auth, remove);
router.get('/:id/students', auth, getStudents);

module.exports = router;
