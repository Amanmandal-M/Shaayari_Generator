const mongoose = require('mongoose');

const dbConnection = mongoose.connect(process.env.MONGO_URI);

module.exports = { dbConnection };