const {Schema, model} = require('mongoose')

const MessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    chat: {
        type: Schema.ObjectId,
        ref: 'Chat',
        required: true
    }
})
MessageSchema
    .virtual('getdate')
    .get(function() {
        const time = (this.date.getHours() < 10 ? ('0' + this.date.getHours()) : this.date.getHours()) + ':' + (this.date.getMinutes() < 10 ? ('0' + this.date.getMinutes()) : this.date.getMinutes())
        const date = (this.date.getDate() < 10 ? ('0' + this.date.getDate()) : this.date.getDate()) + '.' + ((this.date.getMonth() + 1) < 10 ? ('0' + (this.date.getMonth() + 1)) : (this.date.getMonth() + 1)) + '.' + this.date.getFullYear()
        return time + ' ' + date
    })
module.exports = model('Message', MessageSchema)