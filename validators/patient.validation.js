const Joi = require('joi');

// CREATE Patient
exports.validateCreatePatient = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    age: Joi.number().min(1).max(100).required(),
    gender: Joi.string().min(3).max(100).required(),
    phone: Joi.string().min(10).max(11).required(),
    email: Joi.string().email().required(),
    address: Joi.string().min(3).max(100).required()
  });

  return schema.validate(data);
};

// UPDATE Patient
exports.validateUpdatePatient = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100),
    age: Joi.number().min(1).max(100),
    gender: Joi.string().min(3).max(100),
    phone: Joi.string().min(10).max(11),
    email: Joi.string().email(),
    address: Joi.string().min(3).max(100)
  });

  return schema.validate(data);
};