const Work = require('../models/Work');

// Create a new work (travail)
async function createWork(req, res) {
  try {
    const { title, description, type, startDate, endDate, promotion, assignees, groupName } = req.body;

    if (!title || !type || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['individuel', 'collectif'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }

    // Optional role check: only formateur can create works
    const user = req.user || {}; // set by auth middleware
    if (!user.id) return res.status(401).json({ message: 'Unauthorized' });
    if (user.role !== 'formateur' && user.role !== 'directeur') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Build initial assignees according to type
    let initialAssignees = Array.isArray(assignees) ? assignees.map(String) : [];
    if (type === 'individuel') {
      if (initialAssignees.length !== 1) {
        return res.status(400).json({ message: 'Individuel: sélectionner exactement un étudiant' });
      }
    } else if (type === 'collectif') {
      if (initialAssignees.length < 1) {
        return res.status(400).json({ message: 'Collectif: sélectionner au moins un étudiant' });
      }
    }

    const work = await Work.create({
      title,
      description,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: user.id,
      promotion: promotion || undefined,
      assignees: initialAssignees,
      assignments: initialAssignees.length > 0 ? [{
        assignees: initialAssignees,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        groupName: groupName || undefined,
        createdAt: new Date(),
      }] : [],
    });

    res.status(201).json(work);
  } catch (err) {
    console.error('createWork error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// List works created by current user (formateur)
async function listMyWorks(req, res) {
  try {
    const user = req.user || {};
    if (!user.id) return res.status(401).json({ message: 'Unauthorized' });
    const works = await Work.find({ createdBy: user.id }).sort({ createdAt: -1 });
    res.json(works);
  } catch (err) {
    console.error('listMyWorks error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createWork, listMyWorks };
// Get a single work by id (only creator or director)
async function getWorkById(req, res) {
  try {
    const user = req.user || {};
    const work = await Work.findById(req.params.id)
      .populate('assignees')
      .populate('promotion')
      .populate('assignments.assignees');
    if (!work) return res.status(404).json({ message: 'Not found' });
    if (user.role !== 'directeur' && String(work.createdBy) !== String(user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(work);
  } catch (err) {
    console.error('getWorkById error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update a work (only creator or director)
async function updateWork(req, res) {
  try {
    const user = req.user || {};
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ message: 'Not found' });
    if (user.role !== 'directeur' && String(work.createdBy) !== String(user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, description, type, startDate, endDate, promotion } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (type !== undefined) {
      if (!['individuel', 'collectif'].includes(type)) return res.status(400).json({ message: 'Invalid type' });
      updates.type = type;
      // optional: enforce assignees count if switching types
      if (type === 'individuel' && Array.isArray(work.assignees) && work.assignees.length > 1) {
        updates.assignees = work.assignees.slice(0, 1);
      }
    }
    if (startDate !== undefined) updates.startDate = new Date(startDate);
    if (endDate !== undefined) updates.endDate = new Date(endDate);
    if (promotion !== undefined) updates.promotion = promotion || undefined;

    const updated = await Work.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('updateWork error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete a work (only creator or director)
async function deleteWork(req, res) {
  try {
    const user = req.user || {};
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ message: 'Not found' });
    if (user.role !== 'directeur' && String(work.createdBy) !== String(user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await Work.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('deleteWork error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Assign work to students with dates
async function assignWork(req, res) {
  try {
    const user = req.user || {};
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ message: 'Not found' });
    if (user.role !== 'directeur' && String(work.createdBy) !== String(user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { assignees, startDate, endDate, groupName } = req.body; // optional assignees; dates required
    if (!startDate || !endDate) return res.status(400).json({ message: 'startDate and endDate are required' });

    let selected = Array.isArray(assignees) ? assignees.map(String) : (work.assignees || []).map(String);
    if (work.type === 'individuel' && selected.length !== 1) {
      return res.status(400).json({ message: 'Individuel: sélectionner exactement un étudiant' });
    }
    if (work.type === 'collectif' && selected.length < 1) {
      return res.status(400).json({ message: 'Collectif: sélectionner au moins un étudiant' });
    }

    const unique = [...new Set(selected.map(String))];
    // maintain legacy assignees (flat list) as union for quick counts
    const legacySet = new Set([...(work.assignees || []).map(String), ...unique]);
    work.assignees = Array.from(legacySet);

    work.assignments = work.assignments || [];
    work.assignments.push({
      assignees: unique,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      groupName: groupName || undefined,
      createdAt: new Date(),
    });
    await work.save();
    const populated = await Work.findById(work._id).populate('assignments.assignees').populate('assignees');
    res.json(populated);
  } catch (err) {
    console.error('assignWork error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createWork, listMyWorks, getWorkById, updateWork, deleteWork, assignWork };
