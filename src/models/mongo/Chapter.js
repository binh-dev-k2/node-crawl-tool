const mongoose = require("mongoose"), Schema = mongoose.Schema;

const schema = Schema({
    link: { type: String, unique: true, index: true },
    story_id: { type: String, index: true },
    chap: { type: String },
    images: [{ type: String }],
    status: { type: Number }
});

module.exports = mongoose.model('Chapter', schema, 'chapters');
