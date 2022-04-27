const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    eventId: {
        type: String
    },
    userId: {
        type: String
    },
    currentPoint: {
        type: Number
    }
});

module.exports = mongoose.model('Deal', UserSchema);