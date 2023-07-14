const Joi = require('joi');

const otpValidationSchema = Joi.object({
    otp:Joi.string().required().min(6),
})
const emailValidationSchema = Joi.object({
    email:Joi.string().email().required().trim(),
});

const userloginValidation = Joi.object({
    email:Joi.string().email().required().trim(),
    password:Joi.string().required().min(6),
})
const userCreateSchema = Joi.object({
    name:Joi.string().required().trim(),
    email:Joi.string(),
    // email:Joi.s  tring().email().required().trim().lowercase(),
    password:Joi.string().required().min(6),
    mpin:Joi.string().required().min(4).trim()
}).options({ abortEarly: false });

module.exports = {userCreateSchema, emailValidationSchema,userloginValidation}