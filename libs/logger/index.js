const fs = require('fs-extra');
require('colors')

function stream(filePath) {
	if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "") // Write an empty log if it doesn't exist

	return {
		write: function(data) {
			fs.appendFile(filePath, data)
		}
	}
}

class Logger {
	constructor([serviceName, subServiceName], root) {

		const date = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

		if (!root) this.root = `./logs/${serviceName.toLowerCase()}/${date}`
		else this.root = root;

		if (serviceName) this.service = ` [${serviceName}]`
		else this.service = ``

		if (subServiceName) this.subService = `[${subServiceName}] `
		else this.subService = ``

		if (!fs.existsSync(this.root)) fs.mkdirSync(this.root, { recursive: true })
		
		this.streams = {
			success: stream(`${this.root}/success.log`),
			error: stream(`${this.root}/error.log`),
			warn: stream(`${this.root}/warn.log`),
			info: stream(`${this.root}/info.log`)
		};
	}

	success(input) {
		const time = new Date();
		input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [SUCCESS]${this.service}: ${this.subService}${input}`;
		this.streams.success.write(`${input}\n`);

		console.log(`${input}`.green.bold);
	}

	error(input) {
		const time = new Date();
		input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [ERROR]${this.service}: ${this.subService}${input}`;
		this.streams.error.write(`${input}\n`);

		console.log(`${input}`.red.bold);
	}

	warn(input) {
		const time = new Date();
		input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [WARN]${this.service}: ${this.subService}${input}`;
		this.streams.warn.write(`${input}\n`);

		console.log(`${input}`.yellow.bold);
	}

	info(input) {
		const time = new Date();
		input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [INFO]${this.service}: ${this.subService}${input}`;
		this.streams.info.write(`${input}\n`);

		console.log(`${input}`.cyan.bold);
	}

	welcome(input) {
		const time = new Date();
		input = `${input}`;
		this.streams.info.write(`${input}\n`);

		console.log(`${input}`.bgGrey.bold);
	}
}

module.exports = function(serviceName, root) {
	return new Logger(serviceName, root)
};