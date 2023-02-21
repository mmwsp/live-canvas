const {Schema, model} = require('mongoose')

const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    refreshToken: {type: String, required: true},
})

module.exports = model('Token', TokenSchema)