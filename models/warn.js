const { Schema, model } = require('mongoose')

module.exports = model('Warnings', new Schema({
    userId: String,
    guildId: String,
    reason: String,
    moderatorId: String,
    timestamp: String,
}))