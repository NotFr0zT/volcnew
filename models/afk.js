const { Schema, model } = require("mongoose");

const afkSchema = new Schema({
    gid: { type: String },
    userid: { type: String },
    message: { type: String, default: false }
});

module.exports = model("afk", afkSchema);