module.exports = (maxLimit = 10) => {

    return (req, res, next) => {

        let limit = req.query.limit || maxLimit || 0
        if (limit > maxLimit) return next({
            status: 400,
            message: `Limit can't exceed ${maxLimit}!`
        })
        req.limit = limit

        return next();

    }

}