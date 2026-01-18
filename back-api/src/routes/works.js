const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createWork, listMyWorks, getWorkById, updateWork, deleteWork, assignWork } = require('../controllers/workController');

// List current user's works
router.get('/', auth, listMyWorks);

// Create a work
router.post('/', auth, createWork);

// Read one
router.get('/:id', auth, getWorkById);

// Update
router.put('/:id', auth, updateWork);

// Delete
router.delete('/:id', auth, deleteWork);

// Assign
router.post('/:id/assign', auth, assignWork);

module.exports = router;
