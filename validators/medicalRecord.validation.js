const Joi = require('joi');

exports.validateCreateMedicalRecord = (data) => {
  const schema = Joi.object({
    doctor: Joi.string().required(),
    patient: Joi.string().required(),
    diagnosis: Joi.string().min(3).required(),
    prescription: Joi.string().allow(''),
    notes: Joi.string().allow(''),
    date: Joi.date()
  });

  return schema.validate(data);
};

exports.validateUpdateMedicalRecord = (data) => {
  const schema = Joi.object({
    diagnosis: Joi.string().min(3),
    prescription: Joi.string().allow(''),
    notes: Joi.string().allow(''),
    date: Joi.date()
  });

  return schema.validate(data);
};
