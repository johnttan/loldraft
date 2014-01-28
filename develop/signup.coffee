query = require('/models/queries')


module.exports = ()->
    return (req, res, next)->
        query.signup(req, res, next)

