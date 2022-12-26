module.exports = (err, req, res, next) => {

	// If showing server messages to public is disabled, return status only, not any message.
	// BUT! If the requester is a developer and has req.isDev, they will receive the messages.
	if (!config.publicServerMessages) return res.sendStatus(err.status || 400)
	  
	const isSuccessful = (status) => (status > 199 && status < 300)
	
	let msg = {
		success: isSuccessful(err.status),
		message: "",
		...err
	}
	
	// If the server error has a message, set it as response message.
	// If it doesn't, check if the status is successful and set a default message.
	if (err.message) msg.message = err.message
	else msg.message = isSuccessful(err.status) ? `An error occured.` : `Success`
	
	// Set error messages if they exist.
	if (err.error || err.errors) msg.error = err.error || err.errors

	if (!msg.success) {
		if (config.logServerErrors) console.error(err)
	}
	
	return res.status(err.status || 400).json(msg);
}