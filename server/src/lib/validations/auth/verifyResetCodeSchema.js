import Joi from 'joi';

const verifyResetCodeSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  resetCode: Joi.string().required()
});

export default verifyResetCodeSchema;