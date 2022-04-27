const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    picture: {
        type: String
    },
    status: {
        type: String,
        default: 'active'
    }
});

module.exports = mongoose.model('Product', UserSchema);