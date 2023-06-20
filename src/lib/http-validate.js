const Joi = require("joi");

const accessVariableNestedProp = (obj, props) => {
    let current = obj
  for(const prop of props){
      current = current[prop];
    if(!current) return null;
  }
  return current;
}

module.exports = async (req, res, next) => {
    // If running service doesn't have any schema 
    // assigned to global.httpSchema, all requests will get bypassed
    let schemas = global.httpSchema || {};
    if (!schemas) return next();

    let path = req.path;
    let keys = ["body", "query"];
    let schema;

    // If running service is a WDF 
    if (global.service.isWdf) {
        let wdfName = path.split("/")[1]; // Get wdf name from request path
        let queryKey = req.query.d; // Get func query
        // If schemas has wdfName and the func schema exists, set current schema to it
        if (schemas[wdfName] && schemas[wdfName][queryKey])
            schema = schemas[wdfName][queryKey];
        // If not, the request gets bypassed
        else return next();
    }
    // If not, nest schemas
    else {
        schema = accessVariableNestedProp(schemas, path.slice(1).split("/"));
    };

    // No schema, bypass
    if (!schema) return next();

    // Loop through each keys in schema
    keys.forEach(k => {
        let keySchema = schema[k];
        // If schema exists
        if (keySchema) {

            // Make sure the schema is a Joi object
            keySchema = Joi.object().keys(keySchema).unknown(true);

            // Validate schema
            let { value, error } = keySchema.validate(req[k]);

            // If there is an error, throw error
            if (error)
                return next({
                    status: 400,
                    message: `Bad Request`,
                    error: error.message
                });
            
            // The schema was valid, now set all the keys in schema to "req" for easier access in funcs.
            req[k] = value;
        };
    });
    
    return next();
};