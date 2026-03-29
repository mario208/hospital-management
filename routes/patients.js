const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');


const { PatientsDB, validateCreatePatient, validateUpdatePatient } = require('../models/PatientsDB');

/** 
 * @desc Get all Patients
 * @route /patients
 * @method GET
 * @access public
 * 
*/

router.get("/", asyncHandler(
    async (req, res) => {
        const patientsList = await PatientsDB.find().sort({ name: 1 });
        res.status(200).json(patientsList);
    }
));


/** 
 * @desc Get patient by id
 * @route /patients/:id
 * @method GET
 * @access public
 * 
*/

router.get("/:id", asyncHandler(async (req, res) => {
    const patient = await PatientsDB.findById(req.params.id);
    if (patient) {
        res.status(200).json(patient);
    } else {
        res.status(404).json("Patient not found");
    }
}));


/** 
 * @desc Create new Patient
 * @route /patients
 * @method POST
 * @access public
 * 
*/

router.post("/", asyncHandler(async (req, res) => {
    const { error } = validateCreatePatient(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.message });
    }
    const pat = new PatientsDB({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
    });
    const result = await pat.save();
    res.status(201).json(result);
}));



/** 
 * @desc Update patient
 * @route /patients/:id
 * @method PUT
 * @access public
 * 
*/
router.put("/:id", asyncHandler(async (req, res) => {
    const { error } = validateUpdatePatient(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const patient = await PatientsDB.findByIdAndUpdate(req.params.id, {

        $set: {                           // $set is used to update the document
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        }
    }, { new: true });       // (new: true) to return the updated document from mongoDB

    res.status(200).json(patient);
}));




/** 
 * @desc Delete patient
 * @route /patients/:id
 * @method DELETE
 * @access private (only admin)
 * 
*/
router.delete("/:id", verifyTokenAndAdmin,
    asyncHandler(async (req, res) => {
        const patient = await PatientsDB.findById(req.params.id);
        if (patient) {
            await PatientsDB.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Patient Deleted" });
        } else {
            res.status(404).json({ message: "Patient not found" });
        }
    }));
module.exports = router;