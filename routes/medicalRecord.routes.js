const express = require('express');
const router = express.Router();

const {
  createMedicalRecord,
  getAllMedicalRecords,
  getPatientRecords,
  updateMedicalRecord,
  deleteMedicalRecord
} = require('../Controllers/medicalRecord.controller');

const { verifyToken, verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// CREATE (Doctors Only)
router.post('/', verifyTokenAndAdmin, createMedicalRecord);

// GET ALL (Doctors Only)
router.get('/', verifyTokenAndAdmin, getAllMedicalRecords);

// GET PATIENT RECORDS (Patient or Doctor can access this)
router.get('/patient/:patientId', verifyToken, getPatientRecords);

// UPDATE (Doctors Only)
router.put('/:id', verifyTokenAndAdmin, updateMedicalRecord);

// DELETE (Doctors Only)
router.delete('/:id', verifyTokenAndAdmin, deleteMedicalRecord);

module.exports = router;
