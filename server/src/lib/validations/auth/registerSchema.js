import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least 2 characters long.',
      'string.max': 'Name cannot exceed 100 characters.',
      'any.required': 'Name is required.'
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.'
    }),
  role: Joi.string()
    .valid('mentor', 'learner')
    .default('learner')
    .messages({
      'any.only': 'Role must be either "mentor" or "learner".'
    }),
  bio: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Bio cannot exceed 500 characters.'
    }),
  skills: Joi.array()
    .items(Joi.string().max(50))
    .max(10)
    .optional()
    .messages({
      'array.max': 'You can add up to 10 skills.',
      'string.max': 'Each skill cannot exceed 50 characters.'
    }),
  socialLinks: Joi.object({
    github: Joi.string().uri().optional(),
    linkedin: Joi.string().uri().optional(),
    twitter: Joi.string().uri().optional(),
    website: Joi.string().uri().optional()
  }).optional()
});

export default registerSchema;