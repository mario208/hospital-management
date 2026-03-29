// validators/auth.validation.js
const Joi = require('joi');

// Register Validation
exports.validateRegisterUser = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(1024).required(),
    isAdmin: Joi.boolean(), // optional
    age: Joi.number().min(1).max(100).allow(null, ""),
    gender: Joi.string().allow(null, ""),
    phone: Joi.string().min(10).max(11).allow(null, ""),
    address: Joi.string().min(3).max(100).allow(null, ""),
    specialty: Joi.string().allow(null, ""),
    experienceYears: Joi.number().min(1).max(50).allow(null, ""),
    price: Joi.number().min(0).allow(null, ""),
    available: Joi.boolean()
  });
  return schema.validate(data);
};

// Login Validation
exports.validateLoginUser = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(1024).required()
  });
  return schema.validate(data);
};