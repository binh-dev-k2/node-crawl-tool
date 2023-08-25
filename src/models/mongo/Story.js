const mongoose = require("mongoose"), Schema = mongoose.Schema;

const schema = Schema({
    title: { type: String },
    thumbail: { type: String },
    url: { type: String, required: true },
    author: { type: String },
    description: { type: String },
    status: { type: Number, required: true, index: true }
});

module.exports = mongoose.model('Story', schema, 'stories');
