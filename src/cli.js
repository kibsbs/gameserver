const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")

module.exports = (config) => {
    return yargs(hideBin(process.argv))
    .command('serve <service>', 'Initalize a service', (yargs) => {
        return yargs
          .positional('service', {
            describe: 'Service name',
            demandOption: true,
            choices: Object.keys(config.SERVICES)
          })
      }, (argv) => {
        return argv
    })
    .option("env", {
        alias: "e",
        type: "string",
        description: `Service enviroment`,
        choices: config.ENVS
    })
    .option("port", {
        alias: "p",
        type: "number",
        description: "Port to bind on"
    })
    .demandCommand()
    .showHelpOnFail()
    .parse()
}