'use strict';
const connectToDatabase = require("../../../init/db")
const ev = require("../model/model")
const { res } = require("../../../init/res");
module.exports.handler = async (event, context, callback) => {
    await connectToDatabase();
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);
    const findId = await ev.findById(id);
    if (findId) {
        try {
            await ev.findByIdAndUpdate(id, body, { new: true });
            return res("", "Update Success", 200);
        } catch (err) {
            return res("", err, 400);
        }
    } else {
        return res("", "Event not exists!", 404);
    }
};