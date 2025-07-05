import Joi from 'joi';

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  resetCode: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

export default resetPasswordSchema;