import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required()
});

export default loginSchema;