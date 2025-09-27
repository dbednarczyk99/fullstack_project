// Ad.model.js -> new Ad 

const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    author: { type: String, required: true, ref: 'User' },
}, { versionKey: false });

module.exports = mongoose.model('Ad', adSchema);