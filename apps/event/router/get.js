'use strict';
const connectToDatabase = require("../../../init/db")
const ev = require("../model/model")
const { res } = require("../../../init/res");
module.exports.handler = async (event, context, callback) => {
    await connectToDatabase();
    const id = event.pathParameters.id;
    try {
        const data = await ev.findById(id);
        return res(data, 'success', 200);
    } catch (err) {
        return res("", err, 400);
    }
};