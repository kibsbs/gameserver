const Joi = require('joi');

const httpScheme = require('http-scheme');

module.exports = function validateRequest(req, res, next) {

	let options = {};

	let func = req.query.d
	if (!func) return next({
		status: 400,
		message: `Please provide a function!`
	});

	let schema = httpScheme[func];
	let toValidate = {};

	if (!schema) {
		return next();
	}

	["body"].forEach(function(key) {
		if (schema[key]) {
			toValidate[key] = req[key];
		}
	});

	const { error, value } = Joi.object(schema).validate(toValidate, options)

	if (error || !value) {
		global.logger.warn(`${error.message} - ${JSON.stringify(error.details)}`)
		return next({
			status: 400,
			message: error.message,
			error: error.details
		})
	}
	Object.assign(req, value);
	return next();
};