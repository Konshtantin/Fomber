const {Schema, model} = require('mongoose')

const ChatSchema = new Schema({
    chatname: {
        type: String,
        required: true
    },
    chatauthor: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    userCount: {
        type: Number,
        required: true,
        defoult: 0
    }
})

module.exports = model('Chat', ChatSchema)