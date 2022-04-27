const connectToDatabase = require("../../../init/db");
const User = require("../model/model");
const { res } = require("../../../init/res");
const bcrypt = require("bcryptjs");

module.exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let params = JSON.parse(event.body);
    let salt = bcrypt.genSaltSync(10);
    params.password = bcrypt.hashSync(params.password, salt);
    await connectToDatabase();
    let result = await User.find({ username: params.username }).count();
    if (result > 0) {
        return res("", "username already exists",400);
    } else {
        await User.create(params)
        return res("", "success", 200)
    }

};