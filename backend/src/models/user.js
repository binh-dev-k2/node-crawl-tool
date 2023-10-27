const { Schema, model } = require('mongoose');

const userSchema = Schema({
    user_name: { type: String, required: true, min: 6, max: 255 },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    password: { type: String, required: true, min: 7 },
    phone: { type: String, min: 10, max: 10 },
    images: [{ type: String }],
    birth: { type: Date },
    description: { type: String },
    hobbies: [{ type: Object }],
    listAccepted: [{type:String}],
    listIgnore: [{type:String}],
    gender: { type: Number },
    social: { type: String, min: 6, max: 255 },
    description: { type: String },
    is_blocked: { type: Boolean, required: true },
    role: { type: Number, required: true },
    token: { type: String }
});

module.exports = model("User", userSchema, "users");
