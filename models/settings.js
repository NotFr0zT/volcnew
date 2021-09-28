const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    gid: { type: String },
    prefix: { type: String, default: 'v!' },
    levels: { type: Boolean, default: true }
});

module.exports = mongoose.model('settings', newSchema)