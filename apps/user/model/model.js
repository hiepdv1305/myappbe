const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password:{
        type: String,
    },
    avatar: {
        type: String,
        default: 'https://taimienphi.vn/tmp/cf/aut/mAKI-top-anh-dai-dien-dep-chat-1.jpg'
    },
    role: {
        type: String,
        default: 'user'
    }
});

module.exports = mongoose.model('User', UserSchema);