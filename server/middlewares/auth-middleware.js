const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token-service')

module.exports = function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(ApiError.unauthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) {
            return next(ApiError.unauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.unauthorizedError())
        }
        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.unauthorizedError())
    }
}