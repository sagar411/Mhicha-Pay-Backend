const Joi = require("joi");

const sapatiSchema = Joi.object({
    sapatiAmount:Joi.number().required().min(500).max(1000),
    purpose:Joi.string().required(),
    
}).options({abortEarly:false});
module.exports = {sapatiSchema}