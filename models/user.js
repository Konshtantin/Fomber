const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
})

UserSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 8)

    next()
})
module.exports = model('User', UserSchema)
