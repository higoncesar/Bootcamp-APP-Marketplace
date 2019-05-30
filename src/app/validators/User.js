const Joi = require('joi')

module.exports = {
  body: {
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string()
      .min(6)
      .required()
  }
}
