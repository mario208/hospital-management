const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment
} = require('../Controllers/appointment.controller');

const { verifyToken, verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// CREATE (any logged-in user)
router.post('/', verifyToken, createAppointment);

// GET all (context aware based on token)
router.get('/', verifyToken, getAppointments);

// UPDATE (admin only)
router.put('/:id', verifyTokenAndAdmin, updateAppointment);

// DELETE (admin only)
router.delete('/:id', verifyTokenAndAdmin, deleteAppointment);

module.exports = router;