'use strict';
const connectToDatabase = require("../../../init/db")
const deal = require("../model/model")
const { res } = require("../../../init/res");
module.exports.handler = async (event, context, callback) => {
    let user = context.prev;
    await connectToDatabase();
    try {
        const data = await deal.find({ userId: user.id });
        return res(data, "Success", 200);
    } catch (err) {
        return res("", err, 400)
    }
};