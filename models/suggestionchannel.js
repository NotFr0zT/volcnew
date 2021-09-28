const { Schema, model } = require("mongoose");

const schema = new Schema({
    gid: { type: String },
    channel: { type: String, default: "None" }
});

module.exports = model("suggestionchannels", schema);