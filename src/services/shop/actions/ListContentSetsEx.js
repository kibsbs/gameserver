const Joi = require("joi")

module.exports = {
    id: "ListContentSetsEx",
    schema: Joi.object({
        
        ListResultOffset: Joi.number().min(0).default(0),
        ListResultLimit: Joi.number().min(0).default(100),
        Attributes: Joi.array().required(),
        AttributeFiltersEx: Joi.object().keys({
          "cas:FilterType": Joi.array().items(
            Joi.string().default("==")
          ),
          "cas:DataType": Joi.array().items(
            Joi.string().default("string").required()
          ),
          "cas:Name": Joi.array().items(
            Joi.string().default("PricingSelection").required()
          ),
          "cas:Value": Joi.array().items(
            Joi.string().default("RELEASED").required()
          )
        }).required(),
        TitleId: Joi.string().required()

    }).unknown(true)
};