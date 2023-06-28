const Joi = require('joi');

const emailValidationSchema = Joi.object({
    email:Joi.string().email().required().trim(),
    password:Joi.string().required().min(6),
    
});

const userloginValidation = Joi.object({
    email:Joi.string().email().required().trim(),
})
const userCreateSchema = Joi.object({
    name:Joi.string().required().trim(),
    email:Joi.string().email().required().trim().lowercase(),
    password:Joi.string().required().min(6),
    mpin:Joi.string().required().min(4).trim()
}).options({ abortEarly: false });

module.exports = {userCreateSchema, emailValidationSchema}