const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")

module.exports = () => {
    return yargs(hideBin(process.argv))
    .command('serve <service>', 'Initalize a service', (yargs) => {
        return yargs
          .positional('service', {
            describe: 'Service name',
            demandOption: true
          })
      }, (argv) => {
        return argv
    })
    .option("env", {
        alias: "e",
        type: "string",
        description: `Service enviroment`
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