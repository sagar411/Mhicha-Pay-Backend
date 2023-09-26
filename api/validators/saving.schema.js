const Joi = require("joi");

const savingSchema = Joi.object({
    savingamount:Joi.number().required().min(50).max(5000),
    purpose:Joi.string().required(),
    
}).options({abortEarly:false});
module.exports = {savingSchema}