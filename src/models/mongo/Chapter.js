const mongoose = require("mongoose"), Schema = mongoose.Schema;

const schema = Schema({
    url: { type: String, required: true },
    story_id: { type: String, index: true },
    chap: { type: String },
    images: [{ type: String }],
    status: { type: Number, required: true, index: true }
});

module.exports = mongoose.model('Chapter', schema, 'chapters');
