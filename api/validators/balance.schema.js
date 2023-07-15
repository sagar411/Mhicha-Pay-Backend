const Joi = require("joi");

const sendAmountSchema = Joi.object({
    amount : Joi.number().required().min(100).max(10000),
    email: Joi.string().email().required(),
    remarks: Joi.string().required(),
    mpin:Joi.string().required().max(4).min(4),
    purpose: Joi.string().required().valid(
        'Personal Use',
        'Borrow / Lend',
        'Family Expenses',
        'Bill Sharing',
        'Salary',
        'Others'
    )
}).options({ abortEarly: false });
module.exports = {sendAmountSchema}