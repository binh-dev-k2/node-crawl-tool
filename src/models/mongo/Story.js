const mongoose = require("mongoose"), Schema = mongoose.Schema;

const schema = Schema({
    title: { type: String, required: true },
    thumbail: { type: String },
    url: { type: String, required: true, unique: true, index: true },
    author: { type: String },
    description: { type: String },
});

module.exports = mongoose.model('Story', schema, 'stories');
