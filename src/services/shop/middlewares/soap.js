const { existsSync } = require("fs-extra");
const Joi = require("joi");
const xmlbuilder = require('xmlbuilder');

const schema = Joi.object({
    Type: Joi.string().required(),
    Version: Joi.string().required(),
    MessageId: Joi.string().required(),
    DeviceId: Joi.number().required(),
    DeviceToken: Joi.string().optional(),
    AccountId: Joi.number().optional(),
    ApplicationId: Joi.string().optional(),
    TIN: Joi.number().optional(),
    Region: Joi.string().required(),
    Country: Joi.string().required(),
    SerialNo: Joi.string().optional(),
    Language: Joi.string().required()
}).unknown(true);

const schemas = {
    ecs: schema.append({
        SerialNo: Joi.string().required()
    }),
    cas: schema
};

function parseSOAPBody(serviceId, body) {
    body = body[0];

    let obj = {};
    Object.keys(body).forEach(key => {
        let data = body[key];
        
        if (Array.isArray(data)) {
            if (data.length == 1) data = data[0];
            else if (data.length == 0) data = "";
        };

        let isKeyValid = key.split(":") ? key.split(":")[0] == serviceId : null;
        if (!isKeyValid) return null;

        obj[key.split(":")[1]] = data;
    });

    return { Type: body["$"]["xsi:type"], ...obj};
};

module.exports = (req, res, next) => {
    if (req.method !== "POST") return next();

    // Service must be defined before this middleware is called
    const service = req.service;
    if (!service) return next({
        status: 404,
        message: `Unknown service`
    });
    const serviceSchema = schemas[service.id];

    const isECS = service.id == "ecs";
    const isCAS = service.id == "cas";
    
    // Check SOAPAction
    const soapAction = req.headers.soapaction;
    if (!soapAction) {
        return next({
            status: 403,
            message: `No action provided.`
        });
    };

    // Get URN and action from action, verify URN
    const [ urn, action ] = soapAction.split("/");
    if (urn !== service.urn) return next({
        status: 401,
        message: "URN does not match service URN"
    });

    const actionConfPath = __dirname + "/../actions/" + action + ".js";
    if (!existsSync(actionConfPath)) return next({
        status: 404,
        message: `Cannot find action config!`
    });
    const actionConf = require(actionConfPath);
    const actionSchema = actionConf.schema;

    // -----------------
    // Get the actual body, it's a mess
    const envelope = req.body["SOAP-ENV:Envelope"];
    if (!envelope) return next({ status: 403, message: "Invalid body" });

    const soapBody = envelope["SOAP-ENV:Body"];
    if (!soapBody || !soapBody[0]) return next({ status: 403, message: "Invalid body" });

    const body = soapBody[0][`${service.id}:${action}`];
    if (!body) return next({ status: 403, message: "Invalid body" });
    // -----------------

    // Parse body out of it's XML format
    const parsedBody = parseSOAPBody(service.id, body);
    
    // Validate body with Joi
    const { value: serviceBody, error: serviceBodyError } = serviceSchema.validate(parsedBody);
    if (serviceBodyError) return next({
        status: 400,
        message: `Can't parse service body!`,
        error: serviceBodyError
    });

    const { value: actionBody, error: actionBodyError } = actionSchema.validate(serviceBody);
    if (actionBodyError) return next({
        status: 400,
        message: `Can't parse action body!`,
        error: actionBodyError
    });

    const finalBody = { ...serviceBody, ...actionBody };

    // Request type check
    if (finalBody.type == `${service.id}:${action}RequestType`) {
        return next({
            status: 400,
            message: `Invalid request XSI type`
        });
    };

    req.body = finalBody;
    res.soap = (data) => {
        let response = {
            'soapenv:Envelope': {
                '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
                '@xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        
                'soapenv:Body': {
                    [`${action}Response`]: {
                        '@xmlns': urn,
                        Version: finalBody.Version,
                        DeviceId: finalBody.DeviceId,
                        MessageId: finalBody.MessageId,
                        TimeStamp: Date.now(),
                        ErrorCode: "0",
                        ...data
                    }
                }
            }
        };
        return res.status(200).send(xmlbuilder.create(response, { encoding: 'UTF-8' } ).end())
    };

    // Shortcuts
    req.urn = urn;
    req.action = action;
    
    res.set('Content-Type', 'text/xml');
    return next();
};