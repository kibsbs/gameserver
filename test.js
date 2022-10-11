const Joi = require("joi")

const moduleAlias = require("module-alias")
const aliases = require("./aliases")()

const srvConfig = require(`./config/services/wdf`) // Load service's config

global.ENV = "DEV"
global.config = srvConfig

const nasToken = require("./libs/nas-token")

const token = function(checkConnection = true) {
    return Joi.string().required().custom((token, helpers) => {
        // Verify client's token

        let result = {}
        nasToken.verify(token, (err, payload) => {
            if (err) throw new Error(err);

            // Check if their gameId is eligible for connecting to WDF
            if (checkConnection) {
                let [canConnect, reason] = wdfUtils.canPlayerConnect(payload)
                if (!canConnect) throw new Error(reason)
            }

            result = payload
        })
        return result
    });
} 

const schema = Joi.object({
    body: {
        token: token(false)
    }
})
const toValidate = {
    body: {
        token: "n9ZjX2d3wE9SiOrDj9rtPtk%2BpYs2Lkz9fXi9jLJUR3LRFN0c3cwVfp8vGEXNOVr%2BqaZwEqTsJ3VOdHalYtQPuw0qVgMdplYnoB7mqd5Td%2BA%2BT4v1bTWlEGyYqDgaheYs"
    }
}
const { error, value } = schema.validate(toValidate, {})

if (error) {
    console.error(`${error.message} - ${JSON.stringify(error.details)}`)
}

console.log(value) // value is { body: {} }