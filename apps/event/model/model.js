const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    productId: {
        type: String
    },
    productImg: {
        type: String
    },
    productDescription: {
        type: String
    },
    currentPoint: {
        type: Number,
        default: 0
    },
    totalPoint: {
        type: Number
    },
    status: {
        type: String,
        default: 'active'
    }
});

module.exports = mongoose.model('Event', UserSchema);