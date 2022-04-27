'use strict';
const connectToDatabase = require("../../../init/db")
const product = require("../model/model")
const { res } = require("../../../init/res");
module.exports.handler = async (event, context, callback) => {
    let user = context.prev;
    if (user.role != "admin") {
        return res("", "no permision", 500)
    } else {
        await connectToDatabase();
        const id = event.pathParameters.id;
        const body = JSON.parse(event.body);
        const findId = await product.findById(id);
        if (findId) {
            try {
                await product.findByIdAndUpdate(id, body, { new: true });
                return res("", "Update Success", 200);
            } catch (err) {
                return res("", err, 400);
            }
        } else {
            return res("", "Product not exists!", 404);
        }
    }

};