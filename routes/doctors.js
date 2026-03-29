const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const { DoctorsDB, validateCreateDoctor, validateUpdateDoctor } = require('../models/DoctorsDB');
const PatientsDB = require('../models/PatientsDB');


/** 
 * @desc Get all doctors
 * @route /doctors
 * @method GET
 * @access public
 * 
*/
router.get("/", asyncHandler(async (req, res) => {
    const doctors = await DoctorsDB.find().populate("patient", ["_id", "name", "phone"]);
    res.status(200).json(doctors);
}));




/** 
 * @desc Get doctor by id
 * @route /doctors/:id
 * @method GET
 * @access public
 * 
*/

router.get("/:id", asyncHandler(async (req, res) => {
    const doctor = await DoctorsDB.findById(req.params.id).populate("patient");
    if (doctor) {
        res.status(200).json(doctor);
    } else {
        res.status(404).json("Doctor not found");
    }
}));


/** 
 * @desc Create new doctor
 * @route /doctors
 * @method POST
 * @access private (only admin)
 * 
*/

router.post("/", verifyTokenAndAdmin,
    asyncHandler(async (req, res) => {
        const { error } = validateCreateDoctor(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const doc = new DoctorsDB({
            name: req.body.name,
            patient: req.body.patient,
            specialty: req.body.specialty,
            experienceYears: req.body.experienceYears,
            phone: req.body.phone,
            email: req.body.email,
            price: req.body.price,
            available: req.body.available
        }
        )
        const result = await doc.save();
        res.status(201).json(result);
    }));



/** 
 * @desc Update doctor
 * @route /doctors/:id
 * @method PUT
 * @access private (only admin)
 * 
*/
router.put("/:id", verifyTokenAndAdmin,
    asyncHandler(async (req, res) => {
        const { error } = validateUpdateDoctor(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const updatedDoctor = await DoctorsDB.findByIdAndUpdate(req.params.id, {

            $set: {                           // $set is used to update the document
                name: req.body.name,
                patient: req.body.patient,
                specialty: req.body.specialty,
                experienceYears: req.body.experienceYears,
                phone: req.body.phone,
                email: req.body.email,
                price: req.body.price,
                available: req.body.available
            }
        }, { new: true });       // (new: true) to return the updated document from mongoDB

        res.status(200).json(updatedDoctor);

    }));

/** 
 * @desc Delete doctor
 * @route /doctors/:id
 * @method DELETE
 * @access private (only admin)
 * 
*/
router.delete("/:id", verifyTokenAndAdmin,
    asyncHandler(async (req, res) => {

        const doctor = await DoctorsDB.findById(req.params.id);
        if (doctor) {
            await DoctorsDB.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Doctor Deleted" });
        } else {
            res.status(404).json({ message: "Doctor not found" });
        }
    }));

//// export file
module.exports = router;