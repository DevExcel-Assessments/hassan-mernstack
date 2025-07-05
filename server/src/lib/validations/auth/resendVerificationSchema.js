import Joi from 'joi';

const resendVerificationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email format.',
      'any.required': 'Email is required.'
    })
});

export default resendVerificationSchema;
