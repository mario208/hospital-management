const Joi = require('joi');

// CREATE Doctor
exports.validateCreateDoctor = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),

    patient: Joi.string().required(), // ObjectId

    specialty: Joi.string().min(3).max(100).required(),

    experienceYears: Joi.number().min(1).max(10).required(),

    phone: Joi.string().min(10).max(11).required(),

    email: Joi.string().email().required(),

    price: Joi.number().min(0).required(),

    available: Joi.boolean().required()
  });

  return schema.validate(data);
};


// UPDATE Doctor
exports.validateUpdateDoctor = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100),

    patient: Joi.string(),

    specialty: Joi.string().min(3).max(100),

    experienceYears: Joi.number().min(1).max(10),

    phone: Joi.string().min(10).max(11),

    email: Joi.string().email(),

    price: Joi.number().min(0),

    available: Joi.boolean()
  });

  return schema.validate(data);
};