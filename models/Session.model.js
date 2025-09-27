// Session.model.js -> new Session

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    expires: { type: Date, required: true },
    session: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('Session', sessionSchema);