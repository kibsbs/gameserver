const Joi = require("joi").extend(joi => ({
    base: joi.array(),
    coerce: (value, helpers) => ({
        value: value.split ? value.split(';').filter(a => a) : value,
    }),
    type: 'versionArray',
}));
const sidList = Joi.versionArray().required();

let { value, error } = sidList.validate("");

console.log(value)