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
    social: { type: String, min: 6, max: 255 },
    status: { type: Number, required: true },
    is_blocked: { type: Boolean, required: true },
    role: { type: Number, required: true },
    token: { type: String, required: true }
});

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

module.exports = model("User", userSchema, "users");
