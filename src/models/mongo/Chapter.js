const mongoose = require("mongoose"), Schema = mongoose.Schema;

const schema = Schema({
    link: { type: String, unique: true },
    story_id: { type: String },
    chap: { type: String },
    images: [{ type: String }],
    status: { type: Number }
});

module.exports = mongoose.model('Chapter', schema, 'chapters');
