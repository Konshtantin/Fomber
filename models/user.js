const {Schema, model} = require('mongoose')

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
    },
    chats: [{
        chat: {
            type: Schema.ObjectId,
            ref: 'Chat',
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['user', 'moder', 'admin'],
            default: 'user'
        }
    }]
})

module.exports = model('User', UserSchema)
