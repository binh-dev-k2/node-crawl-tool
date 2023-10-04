const mongoose = require('mongoose');
const { MONGODB_URI } = process.env

exports.connect = async () => {
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected!!!'))
        .catch((err) => console.log(err));
}
