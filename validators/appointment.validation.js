const Joi = require('joi');

// CREATE
exports.validateCreateAppointment = (data) => {
  const schema = Joi.object({
    doctor: Joi.string().required(),
    patient: Joi.string().required(),
    date: Joi.date().required(),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled'),
    notes: Joi.string().allow('')
  });

  return schema.validate(data);
};

// UPDATE
exports.validateUpdateAppointment = (data) => {
  const schema = Joi.object({
    doctor: Joi.string(),
    patient: Joi.string(),
    date: Joi.date(),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled'),
    notes: Joi.string().allow('')
  });

  return schema.validate(data);
};