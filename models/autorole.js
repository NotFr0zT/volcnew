const mongoose = require('mongoose');

const nschema = new mongoose.Schema({
    gid: { type: String },
    enabled: { type: Boolean },
    role: { type: Array },
});

module.exports = mongoose.model('autorole', nschema);