const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    activationLink: {type: String},
    isActivated: {type: Boolean, default: false},
})

module.exports = model('User', UserSchema)