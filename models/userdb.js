const mongoose = require("mongoose");
let userdb = new mongoose.Schema({
    userid: { type: String },
    developer: { type: Boolean, default: false },
    banned: { type: Boolean, default: false },
    color: { type: String, default: '#f56942' },
    snipe: { type: Boolean, default: true }
});
module.exports = mongoose.model("userdb", userdb);