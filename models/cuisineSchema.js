const mongoose = require('mongoose');
const typeSchema = new mongoose.Schema({
    name: String
});

const Type = mongoose.model('Type', typeSchema);
module.exports = Type