import Joi from 'joi';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const requestPasswordResetSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .pattern(emailRegex)
    .required()
    .messages({
      'string.email': 'Invalid email format.',
      'string.pattern.base': 'Email must be properly formatted.',
      'any.required': 'Email is required for password reset.'
    })
});

export default requestPasswordResetSchema;