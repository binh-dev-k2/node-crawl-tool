const mongoose = require("mongoose"), Schema = mongoose.Schema;

const schema = Schema({
    user_name: { type: String, required: true, min: 6, max: 255 },
    email: { type: String, required: true, min: 6, max: 255 },
    password: { type: String, required: true, min: 6, max: 255 },
    phone: { type: String, min: 10, max: 10 },
    images: [{ type: String }],
    social: [{ type: { type: String }, url: { type: String, min: 6, max: 255 } }],
    status: { type: Number, required: true },
    is_blocked: { type: Boolean, required: true },
    token: { type: String },
});

module.exports = mongoose.model('User', schema, 'users');
