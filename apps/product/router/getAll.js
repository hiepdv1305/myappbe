'use strict';
const connectToDatabase = require("../../../init/db")
const product = require("../model/model")
const { res } = require("../../../init/res");
module.exports.handler = async (event, context, callback) => {
    await connectToDatabase();
    try {
        const data = await product.find({ status: "active" });
        return res(data, "Success", 200);
    } catch (err) {
        return res("", err, 400)
    }
};