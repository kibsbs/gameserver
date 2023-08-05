const Joi = require("joi")

module.exports = {
    id: "CheckDeviceStatus",
    schema: Joi.object({
        SerialNo: Joi.string().required(),
        ItemId: Joi.number().required(),
    }).unknown(true)
};